import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import getFile from './generate-types.js';
import { exit } from 'process';
import { act } from 'react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tokenPort = getFile(
  path.resolve(__dirname, '../registery/token-port.json'),
  'json'
);
GenerateOverridesTypes(
  './src/components/button/dependencies/button.overrides.json',
  './src/components/button/dependencies/button.types.tsx',
  'button'
);
UseCSSVar(
  './src/components/button/dependencies/style/themes.css',
  'button',
  './src/components/button/dependencies/button.overrides.json'
);

function GenerateOverridesTypes(targetSourcepath, outputPath, targetComponent) {
  if (!targetSourcepath || !outputPath || !targetComponent) return;

  const absoluteSourcePath = path.resolve(
    __dirname,
    '../../',
    targetSourcepath
  );
  const seperator = '/*--!/--*/';

  const absoluteTargetPath = path.resolve(__dirname, '../../', outputPath);
  const sourceFile = getFile(absoluteSourcePath, 'json');
  const targetFile = getFile(absoluteTargetPath, 'tsx');
  const [dynamicPart, staticPart] = targetFile.split(seperator);
  let updatedDynamicPart = dynamicPart.trim();

  for (const [key, val] of Object.entries(sourceFile)) {
    const varname = `Dyvix${capitalize(targetComponent)}${capitalize(key)}Override`;
    let interfaceBody = `export interface ${varname} {\n`;
    for (const [cssVar, choices] of Object.entries(val)) {
      const serializedChoises = SerializeChoices(choices);
      interfaceBody += `  '${cssVar}'?:\n${serializedChoises};\n`;
    }
    interfaceBody += `}`;

    const typeRegex = new RegExp(
      `export interface ${varname} \\{[\\s\\S]*?\\n\\}`
    );
    if (typeRegex.test(updatedDynamicPart)) {
      updatedDynamicPart = updatedDynamicPart.replace(typeRegex, interfaceBody);
    } else {
      updatedDynamicPart = updatedDynamicPart
        ? `${updatedDynamicPart}\n\n${interfaceBody}`
        : interfaceBody;
    }
  }

  updatedDynamicPart = updatedDynamicPart.trimEnd();

  fs.writeFileSync(
    absoluteTargetPath,
    [updatedDynamicPart, staticPart].join(`\n\n${seperator}`)
  );
}
function SerializeChoices(choices) {
  const normalizedVal = choices.split('||').map((choice) => choice.trim());

  const parsedTypes = normalizedVal.map((val) => {
    if (val === 'color' || val === 'string') {
      return '(string & {})';
    }

    if (!isNaN(val) && val !== '') {
      return val;
    }

    if (
      (val.startsWith("'") && val.endsWith("'")) ||
      (val.startsWith('"') && val.endsWith('"'))
    ) {
      return val;
    }

    return `'${val}'`;
  });

  return [...new Set(parsedTypes)].map((val) => `  | ${val}`).join('\n');
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function UseCSSVar(targetSourcepath, component, overrideSourcepath) {
  if (!targetSourcepath) return;

  const absoluteSourcePath = path.resolve(
    __dirname,
    '../../',
    targetSourcepath
  );

  const overrideSourcePath = path.resolve(
    __dirname,
    '../../',
    overrideSourcepath
  );
  const sourceFile = getFile(absoluteSourcePath, 'css');
  const overrideFile = getFile(overrideSourcePath, 'json');
  const CSSBlocks = sourceFile
    .split('}')
    .map((block) => block.trim())
    .filter(Boolean);

  const validOverrideKeys = new Set(
    Object.values(overrideFile).flatMap((section) => Object.keys(section))
  );

  const parsedCSS = CSSBlocks.map((line) => {
    const [selector, content] = line.split('{').map((str) => str.trim());

    if (!content) return null;

    const properties = content
      .split(';')
      .map((prop) => prop.trim())
      .filter(Boolean);

    return [selector, properties];
  }).filter(Boolean);

  const constantOverrideNamePart = `--dyvix-${component}`;

  const finalizedCSS = parsedCSS
    .map(([selector, attributes]) => {
      const splitSelector = selector.split(':');
      const action = splitSelector[1] || null;
      const isValidAction =
        tokenPort.supported_pseudo_classes.includes(action) || action === null;

      if (!isValidAction) {
        return null;
      }
      const SmartAttributes = attributes
        .flatMap((attribute) => {
          const colonIndx = attribute.indexOf(':');
          if (colonIndx === -1) return null;

          const rawProp = attribute.slice(0, colonIndx).trim();
          const rawVal = attribute.slice(colonIndx + 1).trim();
          const cleanProp =
            rawProp === 'background'
              ? 'bg'
              : rawProp.replace(/^-(webkit|moz|ms|o)-/, '');

          const ref = tokenPort.multi_value_splitting[rawProp];
          if (ref) {
            const expandedProps = ParseCSSMultiVal(rawProp, rawVal);

            if (!expandedProps) return `${rawProp}: ${rawVal};`;
            //output like   'transform: scale(0.95)'
            return Object.entries(expandedProps)
              .map(([subProp, val]) => {
                const overrideLookupVal = [
                  constantOverrideNamePart,
                  action,
                  subProp
                ]
                  .filter(Boolean)
                  .join('-');
                if (!validOverrideKeys.has(overrideLookupVal))
                  return `${subProp}: ${val};`;
                const constructedLine =
                  [subProp, `var(${overrideLookupVal}, ` + val]
                    .filter(Boolean)
                    .join(': ') + ');';

                return constructedLine || null;
              })
              .filter(Boolean);
          } else {
            const overrideLookupVal = [
              constantOverrideNamePart,
              action,
              cleanProp
            ]
              .filter(Boolean)
              .join('-');
            if (!validOverrideKeys.has(overrideLookupVal))
              return `${rawProp}: ${rawVal};`;
            const constructedLine =
              [rawProp, `var(${overrideLookupVal}, ` + rawVal]
                .filter(Boolean)
                .join(': ') + ');';
            return constructedLine || null;
          }
        })
        .filter(Boolean);
      if (SmartAttributes.length === 0) return null;
      return `${selector} {\n  ${SmartAttributes.join('\n  ')}\n}`;
    })
    .filter(Boolean);
  const cssString = finalizedCSS.join('\n\n');

  fs.writeFileSync(absoluteSourcePath, cssString, 'utf-8');
}

function ParseCSSMultiVal(property, val) {
  const ref = tokenPort.multi_value_splitting[property];
  if (!ref) {
    return null;
  }

  const result = {};
  const splitVal = val.trim().split(/\s+(?![^(]*\))/);
  splitVal.map((val) => {
    for (const [subProp, rule] of Object.entries(ref)) {
      if (!result[subProp] && checkIntegrety(val, rule)) {
        result[subProp] = val;
        break;
      }
    }
  });

  return result;
}

function checkIntegrety(val, rules) {
  const splitRules = new Set(
    rules
      .split('||')
      .map((rule) => rule.trim())
      .filter(Boolean)
  );
  const ruleTypes = tokenPort.types;
  let isValid = false;

  splitRules.forEach((rule) => {
    const alternateRule = ruleTypes[rule];

    if (alternateRule && alternateRule.length > 0) {
      const hasMatch = alternateRule.some((type) => {
        const cleanVal = val.toLowerCase();
        const cleanType = type.toLowerCase();

        return (
          cleanVal === cleanType ||
          cleanVal.endsWith(cleanType) ||
          cleanVal.startsWith(`${cleanType}(`) ||
          (cleanType === '#' && cleanVal.startsWith('#'))
        );
      });

      if (hasMatch) {
        isValid = true;
      }
    } else {
      if (rule === 'number' && !isNaN(Number(val))) {
        isValid = true;
      } else if (rule.toLowerCase() === val.toLowerCase()) {
        isValid = true;
      }
    }
  });

  return isValid;
}
