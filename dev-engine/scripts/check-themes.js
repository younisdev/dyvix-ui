import fs from 'fs';
import path from 'path';
const REGISTERY_PATH = path.resolve('./src/registry/themes.json');
const CMP_PATH = path.resolve('./src/components');

const targetComponent = process.argv[2]?.toLowerCase();
let globalThemes = JSON.parse(getThemeData(REGISTERY_PATH)).map(
  (reg) => reg.theme
);
let result = [];

if (targetComponent !== '*') {
  const missing = getMissingThemes(targetComponent);
  const status =
    missing[0] !== 'LACKS_THEME_SUPPORT'
      ? missing?.length === 0
        ? 'complete'
        : 'missing'
      : 'unsupported';
  result.push({
    component: targetComponent,
    status: status,
    missingThemes: missing
  });
} else {
  const componentMap = fs
    .readdirSync(CMP_PATH, { withFileTypes: true })
    .filter((file) => file.isDirectory())
    .map((file) => file.name);

  for (const cmp of componentMap) {
    const missing = getMissingThemes(cmp);
    const status =
      missing[0] !== 'LACKS_THEME_SUPPORT'
        ? missing?.length === 0
          ? 'complete'
          : 'missing'
        : 'unsupported';
    result.push({ component: cmp, status: status, missingThemes: missing });
  }
}

console.log(JSON.stringify(result, null, 2));

function getMissingThemes(targetComponent) {
  let missingThemes = [];
  const targetPath = path.join(
    CMP_PATH,
    targetComponent,
    '/dependencies/style/themes.css'
  );

  const rawCSS = getThemeData(targetPath);

  if (!rawCSS) {
    console.warn(
      `Skipping [${targetComponent.toUpperCase()}]: 'themes.css' not found.`
    );
    return ['LACKS_THEME_SUPPORT'];
  }

  globalThemes.forEach((theme) => {
    const expectedClass = `.dyvix-${targetComponent}-${theme.toLowerCase()}`;
    const match = CheckCSSClass(expectedClass, rawCSS);

    if (!match) {
      missingThemes.push(theme);
    }
  });

  return missingThemes;
}

function getThemeData(path) {
  try {
    const data = fs.readFileSync(path, 'utf-8');
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
