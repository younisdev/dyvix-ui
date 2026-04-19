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
  const layerOneResult = null; // plug the actual func
  if (layerOneResult !== null) return layerOneResult;
  const layerTwoResult = null; // plug the actual func
  if (layerTwoResult !== null) return layerTwoResult;
  const layerThreeResult = await cachelayerThree(
    jsonpath,
    csspath,
    type,
    3,
    component,
    utility,
    jsonKey,
    jsonclasskey
  );
  const key = generateCacheKey(2, component, utility);
  if (layerThreeResult === null) return layerThreeResult;
  if (layerThreeResult?.CSS) {
    InjectCSS(layerThreeResult.CSS, key);
  }
  return layerThreeResult.JSON;
}

async function cachelayerThree(
  jsonpath,
  csspath,
  type,
  layer,
  component,
  utility,
  jsonKey,
  jsonclasskey
) {
  const key = generateCacheKey(3, 'Modal', 'theme');
  let JsonArray = null;
  let rawCSS = null;
  let cssResult = null;
  let jsonResult = null;

  if (localStorage.getItem(key)) {
    const cachedData = JSON.parse(localStorage.getItem(key));
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

  localStorage.setItem(key, JSON.stringify(value));

  if (!jsonResult) {
    return null;
  }

  cssResult = await extractCSSClass(jsonResult[jsonclasskey], null, rawCSS);

  let result = {
    ...(cssResult !== null && { CSS: cssResult }),
    ...(jsonResult !== null && { JSON: jsonResult })
  };

  return result;
}
async function cachelayerTwo(
  jsonpath,
  csspath,
  type,
  layer,
  component,
  utility,
  jsonKey,
  jsonclasskey
) {
  const key = generateCacheKey(2, component, utility);

  if (localStorage.getItem(key)) {
    return JSON.parse(localStorage.getItem(key));
  }

  const rawJSONText = await extractFile(jsonpath);

  const JsonArray = JSON.parse(rawJSONText);
  const jsonResult = JsonArray.find((e) => e[utility] === jsonKey);
  let cssResult = null;

  if (type === CACHETYPE.CSS) {
    cssResult = extractCSSClass(jsonResult[jsonclasskey], csspath);
  }

  let value = {
    ...(cssResult !== null && { CSS: cssResult }),
    ...(jsonResult !== null && { JSON: JSON.stringify(jsonResult) })
  };

  localStorage.setItem(key, JSON.stringify(value));

  return JSON.stringify(value);
}

async function cachelayerOne(type, classname = 'None', jsonpath) {
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

function generateCacheKey(layer, component, utility) {
  const key = `DYVIX_${VERSION}_${layer}_${component}_${utility}`;

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

export async function ValidatAndLoadJSON(mapper, key, callback, utilityKey, component) {
  if (!mapper) return false;
  
  mapper = mapper[utilityKey];
  let type = mapper["csspath"] !== null ? CACHETYPE.CSS : CACHETYPE.Default;

  const res = await SJCManager(
    mapper["jsonpath"],
    mapper["csspath"],
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
