import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REGISTERY_PATH = path.resolve(
  __dirname,
  '../../src/themeRegistry/themes.json'
);

GenerateTypes(
  './src/components/animations.json',
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
  targetComponent
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
    data = sourceFile.map((e) => e[jsonTargetKey]).filter(Boolean);
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
    `type ${varname} =\\s*(?:\\|?\\s*'[^']*'\\s*)+;`,
    'g'
  );
  let newPart;
  if (typeRegex.test(dynamicPart)) {
    newPart = dynamicPart.replace(typeRegex, newTypeDefinition);
  } else {
    newPart = `${dynamicPart}\n${newTypeDefinition}`;
  }

  fs.writeFileSync(
    absoluteTargetPath,
    [newPart, staticPart].join(`\n\n${seperator}`)
  );
}

function getFile(path, type) {
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
