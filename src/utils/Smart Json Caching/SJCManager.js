import { EvaluateFailure, GaurdStatus } from '../DyvixGuard';
import Version from '../../../package.json';

export const CACHETYPE = { CSS: 'css', Default: 'default' };
const VERSION = Version['version'];

export async function SJCManager(
  jsonpath,
  csspath,
  type,
  component,
  utility,
  jsonKey,
  jsonclasskey = ''
) {
  let result = null;
  const key = generateCacheKey(component, utility);
  result = await cachelayerOne();
  (jsonpath, csspath, type, component, utility, jsonKey, jsonclasskey, key);

  if (result === null)
    result = await cachelayerTwo(
      jsonpath,
      csspath,
      type,
      component,
      utility,
      jsonKey,
      jsonclasskey,
      key
    );
  if (result === null)
    result = await cachelayerThree(
      jsonpath,
      csspath,
      type,
      component,
      utility,
      jsonKey,
      jsonclasskey,
      key
    );

  if (result === null) return result;

  if (result?.CSS) {
    InjectCSS(result.CSS, key);
  }
  return result.JSON;
}

async function cachelayerThree(
  jsonpath,
  csspath,
  type,
  component,
  utility,
  jsonKey,
  jsonclasskey,
  key
) {
  let JsonArray = null;
  let rawCSS = null;
  let cssResult = null;
  let jsonResult = null;
  let keys = [key + '_L1', key + '_L2', key + '_L3'];

  if (localStorage.getItem(keys[2])) {
    const cachedData = JSON.parse(localStorage.getItem(keys[2]));
    JsonArray = cachedData.JSON;
    rawCSS = cachedData.CSS;
  } else {
    const rawJSONText = await extractFile(jsonpath);
    JsonArray = JSON.parse(rawJSONText);
    if (type === CACHETYPE.CSS) {
      rawCSS = await extractFile(csspath);
    }
  }
  jsonResult = JsonArray.find((e) => e[utility] === jsonKey);
  let value = {
    ...(rawCSS !== null && { CSS: rawCSS }),
    ...(JsonArray !== null && { JSON: JsonArray })
  };

  localStorage.setItem(keys[2], JSON.stringify(value));

  if (!jsonResult) {
    return null;
  }

  cssResult = await extractCSSClass(jsonResult[jsonclasskey], null, rawCSS);

  let result = {
    ...(cssResult !== null && { CSS: cssResult }),
    ...(jsonResult !== null && { JSON: jsonResult })
  };

  const rawL2Cache = localStorage.getItem(keys[1]);
  const existingL2cache = rawL2Cache ? JSON.parse(rawL2Cache) : {};
  existingL2cache[jsonKey] = result;
  localStorage.setItem(keys[1], JSON.stringify(existingL2cache));

  const rawL1Cache = localStorage.getItem(keys[0]);
  const existingL1cache = rawL1Cache ? JSON.parse(rawL1Cache) : {};
  existingL1cache[jsonKey] = {
    ...result,
    expires: Date.now() + 30 * 24 * 60 * 60 * 1000
  };
  localStorage.setItem(keys[0], JSON.stringify(existingL1cache));
  console.log('L3');
  return result;
}

// Caches only the config ever used
async function cachelayerTwo(
  jsonpath,
  csspath,
  type,
  component,
  utility,
  jsonKey,
  jsonclasskey,
  key
) {
  let cssResult = null;
  let jsonResult = null;

  key += '_L2';
  let cachedData = null;

  if (!localStorage.getItem(key)) return null;

  cachedData = JSON.parse(localStorage.getItem(key));
  const entry = cachedData[jsonKey];
  if (!entry) return null;

  jsonResult = entry.JSON;
  cssResult = entry.CSS;
  let result = {
    ...(cssResult !== null && { CSS: cssResult }),
    ...(jsonResult !== null && { JSON: jsonResult })
  };
  return result;
}

async function cachelayerOne(
  jsonpath,
  csspath,
  type,
  component,
  utility,
  jsonKey,
  jsonclasskey,
  key
) {
  return null;
  extractCSSClass(
    'dyvix-modal-ember',
    '../../components/modal/dependencies/style/themes.css'
  );
  if (type === CACHETYPE.CSS) {
  }
}

async function extractFile(path) {
  try {
    const module = await import(/* @vite-ignore */ `${path}?raw`);
    return module.default || module;
  } catch (error) {
    console.log('DyvixUI Sys error');
    return null;
  }
}

function generateCacheKey(component, utility) {
  const key = `DYVIX_${VERSION}_${component}_${utility}`;

  return key;
}

async function extractCSSClass(classname, Csspath = null, cssblock = null) {
  let rawCSS = null;
  if (Csspath !== null) {
    try {
      const module = await import(/* @vite-ignore */ `${Csspath}?raw`);
      rawCSS = module.default || module;
    } catch (error) {
      console.log('DyvixUI Sys error');
    }
  } else if (cssblock !== null) {
    rawCSS = cssblock;
  } else {
    return null;
  }

  const lines = rawCSS.replace(/\s+/g, ' ').trim().split('}');
  let block = '';
  const matches = lines
    .filter((val) => val.trim().includes(classname))
    .map((block) => block.trim() + '}');
  block = matches.join('\n\n');

  return block;
}

function InjectCSS(csstext, Key) {
  const existing = document.getElementById(Key);

  if (existing) return;
  const style = document.createElement('style');
  style.id = Key;
  style.type = 'text/css';
  style.textContent = csstext;
  document.head.appendChild(style);
}

export async function ValidatAndLoadJSON(
  cacheMap,
  key,
  callback,
  utilityKey,
  component
) {
  if (!cacheMap) return false;

  const mapper = cacheMap[utilityKey];
  let type = mapper['csspath'] !== null ? CACHETYPE.CSS : CACHETYPE.Default;
  const res = await SJCManager(
    mapper['jsonpath'],
    mapper['csspath'],
    type,
    component,
    utilityKey,
    key,
    'class'
  );
  callback((prev) => {
    if (prev[utilityKey] === res) return prev;
    return { ...prev, [utilityKey]: res };
  });
  return res !== null;
}
