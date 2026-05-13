import { EvaluateFailure, GaurdStatus } from '../DyvixGuard';
import Version from '../../../package.json';
import { set, get } from 'idb-keyval';
import { CSS_LIBRARY, JSON_LIBRARY } from './SJCRegistry';
export const CACHETYPE = { CSS: 'css', Default: 'default' };
const VERSION = Version['version'];

export async function SJCManager(
  jsonpath,
  csspath,
  type,
  component,
  utility,
  jsonKey,
  jsonclasskey = '',
  instance
) {

  let result = null;
  const key = generateCacheKey(component, utility);
  result = await cachelayerOne(
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

  if (result?.CSS !== undefined && result?.CSS !== null) {
    InjectCSS(result.CSS, key, instance);
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
  const cachedData = await get(keys[2]);

  if (cachedData) {
    JsonArray = cachedData.JSON;
    rawCSS = cachedData.CSS;
  } else {
    const rawJSONText = await extractFile(jsonpath);
    JsonArray = typeof rawJSONText === 'string' ? JSON.parse(rawJSONText) : rawJSONText;
    if (type === CACHETYPE.CSS) {
      rawCSS = await extractFile(csspath);
    }
  }
  jsonResult = JsonArray.find((e) => e[utility] === jsonKey);
  let value = {
    ...(rawCSS !== null && { CSS: rawCSS }),
    ...(JsonArray !== null && { JSON: JsonArray })
  };

  await set(keys[2], value);

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
// Caches only the config ever used in a month. Limited to 10.
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
  let cssResult = null;
  let jsonResult = null;

  key += '_L1';
  let cachedData = null;

  if (!localStorage.getItem(key)) return null;

  cachedData = JSON.parse(localStorage.getItem(key));

  Object.keys(cachedData).forEach((element) => {
    const expires_at = cachedData[element].expires;

    if (expires_at && expires_at < Date.now()) {
      delete cachedData[element];
    }
  });

  localStorage.setItem(key, JSON.stringify(cachedData));

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

async function extractFile(path) {
  if (!path) {
    console.warn("DyvixUI: Invalid path");
    return null;
  }

  let content = null;

  if (path.endsWith('.css')) {
    content = CSS_LIBRARY[path];
  } else if (path.endsWith('.json')) {
    content = JSON_LIBRARY[path];
  }

  if (content) return content;

  // dev fallback only
  try {
    const response = await fetch(path);
    if (!response.ok) {
      console.warn(`DyvixUI: Content not found at ${path}`);
      return null;
    }
    const text = await response.text();
    if (text.trim().startsWith('<')) {
      console.warn(`DyvixUI: Got HTML instead of content at ${path}`);
      return null;
    }
    return text;
  } catch {
    console.warn(`DyvixUI: Failed to fetch ${path}`);
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
    rawCSS = extractFile(Csspath);
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

function InjectCSS(csstext, Key, instance) {
  if (instance === null) return false;
  Key = Key + `_${instance}`;
  const existing = document.getElementById(Key);

  if (existing) {
    if (existing.textContent === csstext) return true;

    existing.textContent = csstext;
    return true;
  }
  const style = document.createElement('style');
  style.id = Key;
  style.type = 'text/css';
  style.textContent = csstext;
  document.head.appendChild(style);
  return true;
}

export async function ValidatAndLoadJSON(
  cacheMap,
  key,
  callback,
  utilityKey,
  component,
  instance = null
) {
  if (!cacheMap) return false;

  const mapper = cacheMap[utilityKey];
  let type = mapper?.csspath !== null ? CACHETYPE.CSS : CACHETYPE.Default;
  const res = await SJCManager(
    mapper['jsonpath'],
    mapper['csspath'],
    type,
    component,
    utilityKey,
    key,
    'class',
    instance
  );
  callback((prev) => {
    if (prev[utilityKey] === res) return prev;
    return { ...prev, [utilityKey]: res };
  });

  return { config: { [utilityKey]: res }, status: res !== null };
}
