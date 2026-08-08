import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import getFile from './generate-types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

GenerateOverridesTypes(
  './src/components/button/dependencies/button.overrides.json',
  './src/components/button/dependencies/button.types.tsx',
  'button'
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
