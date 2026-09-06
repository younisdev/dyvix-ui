import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REGISTERY_PATH = path.resolve(
  __dirname,
  '../../src/registry/themes.json'
);

GenerateTypes(
  './src/registry/animations.json',
  null,
  'DyvixButtonAnimation',
  './src/components/button/dependencies/button.types.tsx',
  'animation',
  'button'
);
GenerateTypes(
  null,
  './src/components/button/dependencies/style/themes.css',
  'DyvixButtonThemes',
  './src/components/button/dependencies/button.types.tsx',
  '',
  'button'
);
GenerateTypes(
  './src/registry/animations.json',
  null,
  'DyvixNavAnimation',
  './src/components/nav/dependencies/navigation.types.tsx',
  'animation',
  'nav'
);
GenerateTypes(
  null,
  './src/components/nav/dependencies/style/themes.css',
  'DyvixNavThemes',
  './src/components/nav/dependencies/navigation.types.tsx',
  '',
  'nav'
);
GenerateTypes(
  './src/registry/animations.json',
  null,
  'DyvixTableAnimation',
  './src/components/table/dependencies/table.types.tsx',
  'animation',
  'table'
);
GenerateTypes(
  null,
  './src/components/table/dependencies/style/themes.css',
  'DyvixTableThemes',
  './src/components/table/dependencies/table.types.tsx',
  '',
  'table'
);
GenerateTypes(
  './src/registry/animations.json',
  null,
  'DyvixSelectAnimation',
  './src/components/select/dependencies/select.types.tsx',
  'animation',
  'select'
);
GenerateTypes(
  null,
  './src/components/select/dependencies/style/themes.css',
  'DyvixSelectThemes',
  './src/components/select/dependencies/select.types.tsx',
  '',
  'select'
);
GenerateTypes(
  './src/registry/animations.json',
  null,
  'DyvixModalAnimation',
  './src/components/modal/dependencies/modal.types.tsx',
  'animation',
  'modal'
);
GenerateTypes(
  null,
  './src/components/modal/dependencies/style/themes.css',
  'DyvixModalThemes',
  './src/components/modal/dependencies/modal.types.tsx',
  '',
  'modal'
);
GenerateTypes(
  './src/components/modal/dependencies/types.json',
  null,
  'DyvixModalTypes',
  './src/components/modal/dependencies/modal.types.tsx',
  'type',
  'modal'
);
GenerateTypes(
  './src/components/modal/dependencies/presets.json',
  null,
  'DyvixModalPresets',
  './src/components/modal/dependencies/modal.types.tsx',
  'preset',
  'modal'
);
GenerateTypes(
  './src/components/modal/dependencies/validator/validators.json',
  null,
  'DyvixModalValidators',
  './src/components/modal/dependencies/modal.types.tsx',
  'preset',
  'modal'
);
GenerateTypes(
  './src/components/modal/dependencies/elements.json',
  null,
  'DyvixModalElementTypes',
  './src/components/modal/dependencies/modal.types.tsx',
  'element',
  'modal',
  'inherited-element'
);
GenerateTypes(
  './src/registry/animations.json',
  null,
  'DyvixLabelAnimation',
  './src/components/label/dependencies/label.types.tsx',
  'animation',
  'label'
);
GenerateTypes(
  null,
  './src/components/label/dependencies/style/themes.css',
  'DyvixLabelThemes',
  './src/components/label/dependencies/label.types.tsx',
  '',
  'label'
);
GenerateTypes(
  './src/registry/animations.json',
  null,
  'DyvixInputAnimation',
  './src/components/input/dependencies/input.types.tsx',
  'animation',
  'input'
);
GenerateTypes(
  null,
  './src/components/input/dependencies/style/themes.css',
  'DyvixInputThemes',
  './src/components/input/dependencies/input.types.tsx',
  '',
  'input'
);
GenerateTypes(
  './src/components/input/dependencies/types.json',
  null,
  'DyvixInputType',
  './src/components/input/dependencies/input.types.tsx',
  'type',
  'input'
);
GenerateTypes(
  './src/registry/animations.json',
  null,
  'DyvixToastAnimation',
  './src/components/toast/dependencies/toast.types.tsx',
  'animation',
  'toast'
);
GenerateTypes(
  './src/components/toast/dependencies/positions.json',
  null,
  'DyvixToastPosition',
  './src/components/toast/dependencies/toast.types.tsx',
  'position',
  'toast'
);
GenerateTypes(
  './src/components/toast/dependencies/types.json',
  null,
  'DyvixToastType',
  './src/components/toast/dependencies/toast.types.tsx',
  'type',
  'toast'
);
GenerateTypes(
  './src/registry/animations.json',
  null,
  'DyvixFileAnimation',
  './src/components/file/dependencies/file.types.tsx',
  'animation',
  'file'
);
GenerateTypes(
  null,
  './src/components/file/dependencies/style/themes.css',
  'DyvixFileThemes',
  './src/components/file/dependencies/file.types.tsx',
  '',
  'file'
);
GenerateTypes(
  './src/registry/animations.json',
  null,
  'DyvixMarqueeAnimation',
  './src/components/marquee/dependencies/marquee.types.tsx',
  'animation',
  'marquee'
);
GenerateTypes(
  null,
  './src/components/marquee/dependencies/style/themes.css',
  'DyvixMarqueeThemes',
  './src/components/marquee/dependencies/marquee.types.tsx',
  '',
  'marquee'
);
/**
 * Generates TypeScript union types for dynamic properties (themes, animations, etc.)
 *
 * @param {string} jsonpath - Path to JSON source file (pass empty string/null if none)
 * @param {string} csspath - Path to CSS source file (pass empty string/null if none)
 * @param {string} varname - The exported TypeScript type name
 * @param {string} outputPath - Target .types.ts file path
 * @param {string} jsonTargetKey - Identifier key for json propertie
 */
function GenerateTypes(
  jsonpath,
  csspath,
  varname,
  outputPath,
  jsonTargetKey = '',
  targetComponent,
  inheritanceKey = ''
) {
  const targetSourcepath = jsonpath || csspath;
  if (!targetSourcepath || !outputPath) return;

  const type = targetSourcepath.includes('.json') ? 'json' : 'css';

  if (type === 'json' && !jsonTargetKey) return;

  const absoluteSourcePath = path.resolve(
    __dirname,
    '../../',
    targetSourcepath
  );
  const absoluteTargetPath = path.resolve(__dirname, '../../', outputPath);
  const sourceFile = getFile(absoluteSourcePath, type);
  const targetFile = getFile(absoluteTargetPath, 'tsx');

  let data = [];

  if (type === 'json') {
    data = Array.isArray(sourceFile)
      ? sourceFile
          .flatMap((e) => {
            const primary = e[jsonTargetKey];
            const inherited =
              inheritanceKey && e[inheritanceKey]
                ? [].concat(e[inheritanceKey])
                : [];
            return [primary, ...inherited];
          })
          .flat()
          .filter(Boolean)
      : [];
  } else {
    let globalThemes = getFile(REGISTERY_PATH, 'json').map((reg) => reg.theme);
    globalThemes.forEach((theme) => {
      const expectedClass = `.dyvix-${targetComponent}-${theme.toLowerCase()}`;
      const match = CheckCSSClass(expectedClass, sourceFile);

      if (match) {
        data.push(theme);
      }
    });
  }

  const unionTypes = data.map((val) => `  | '${val}'`).join('\n');
  const newTypeDefinition = `export type ${varname} =\n${unionTypes};`;
  const seperator = '/*--!/--*/';
  const [dynamicPart, staticPart] = targetFile.split(seperator);
  const typeRegex = new RegExp(
    `export type ${varname} =\\s*(?:\\|?\\s*'[^']*'\\s*)+;`,
    'g'
  );
  let newPart;
  if (typeRegex.test(dynamicPart)) {
    newPart = dynamicPart.replace(typeRegex, newTypeDefinition);
  } else {
    newPart = `${dynamicPart}\n${newTypeDefinition}`;
  }

  newPart = newPart.trimEnd();

  fs.writeFileSync(
    absoluteTargetPath,
    [newPart, staticPart].join(`\n\n${seperator}`)
  );
}

export default function getFile(path, type) {
  try {
    const data =
      type === 'json'
        ? JSON.parse(fs.readFileSync(path, 'utf-8'))
        : fs.readFileSync(path, 'utf-8');
    return data;
  } catch (error) {
    return null;
  }
}

function CheckCSSClass(classname, rawCSS) {
  const lines = rawCSS.replace(/\s+/g, ' ').trim().split('}');
  let block = '';
  const matches = lines
    .filter((val) => val.trim().includes(classname))
    .map((block) => block.trim() + '}');
  block = matches.join('\n\n');

  return block;
}
