import { EvaluateFailure, GuardStatus } from '../DyvixGuard';
import Version from '../../../package.json';
import { set, get } from 'idb-keyval';
import { CSS_LIBRARY, JSON_LIBRARY } from './SJCRegistry';
export const CACHETYPE = { CSS: 'css', Default: 'default' } as const;
const VERSION = Version['version'];
type CACHETYPETYPE = (typeof CACHETYPE)[keyof typeof CACHETYPE];

export async function SJCManager(
  jsonpath: string | null,
  csspath: string | null,
  type: CACHETYPETYPE,
  component: string,
  utility: string,
  jsonKey: string,
  jsonclasskey: string,
  instance: string | number | null,
  jsonfield: string | null
) {
  let result = null;
  const key = generateCacheKey(component, utility);

  jsonfield = jsonfield || utility;

  result = await cachelayerOne(jsonKey, key);

  if (result === null) result = await cachelayerTwo(jsonKey, key);
  if (result === null)
    result = await cachelayerThree(
      jsonpath,
      csspath,
      type,
      component,
      utility,
      jsonKey,
      jsonclasskey,
      key,
      jsonfield
    );

  if (result === null) return result;

  if (result?.CSS !== undefined && result?.CSS !== null) {
    InjectCSS(result.CSS, key, instance);
  }
  return result.JSON;
}

async function cachelayerThree(
  jsonpath: string | null,
  csspath: string | null,
  type: CACHETYPETYPE,
  component: string,
  utility: string,
  jsonKey: string,
  jsonclasskey: string,
  key: string,
  jsonfield: string
) {
  let JsonArray = null;
  let rawCSS = null;
  let cssResult = null;
  let jsonResult = null;
  let keys = [key + '_L1', key + '_L2', key + '_L3'];
  const cachedData = await get(keys[2]!);

  if (cachedData) {
    JsonArray = cachedData.JSON;
    rawCSS = cachedData.CSS;
  } else {
    const rawJSONText = await extractFile(jsonpath);
    JsonArray =
      typeof rawJSONText === 'string' ? JSON.parse(rawJSONText) : rawJSONText;
    if (type === CACHETYPE.CSS) {
      rawCSS = await extractFile(csspath);
    }
  }

  if (Array.isArray(JsonArray)) {
    jsonResult = JsonArray.find(
      (e: Record<string, any>) => e[jsonfield] === jsonKey
    );
  }
  if (utility === 'theme') {
    jsonResult = await resolveTheme(jsonResult, jsonKey, component);
  }

  let value = {
    ...(rawCSS !== null && { CSS: rawCSS }),
    ...(JsonArray !== null && { JSON: JsonArray })
  };

  await set(keys[2]!, value);

  if (!jsonResult) {
    return null;
  }

  cssResult = await extractCSSClass(jsonResult[jsonclasskey], null, rawCSS);

  let result = {
    ...(cssResult !== null && { CSS: cssResult }),
    ...(jsonResult !== null && { JSON: jsonResult })
  };

  const rawL2Cache = localStorage.getItem(keys[1]!);
  const existingL2cache = rawL2Cache ? JSON.parse(rawL2Cache) : {};
  existingL2cache[jsonKey] = result;
  localStorage.setItem(keys[1]!, JSON.stringify(existingL2cache));

  const rawL1Cache = localStorage.getItem(keys[0]!);
  const existingL1cache = rawL1Cache ? JSON.parse(rawL1Cache) : {};
  existingL1cache[jsonKey] = {
    ...result,
    expires: Date.now() + 30 * 24 * 60 * 60 * 1000
  };
  localStorage.setItem(keys[0]!, JSON.stringify(existingL1cache));
  return result;
}

// Caches only the config ever used
async function cachelayerTwo(jsonKey: string, key: string) {
  let cssResult = null;
  let jsonResult = null;

  key += '_L2';
  let cachedData = null;
  const rawData = localStorage.getItem(key);

  if (!rawData) return null;

  cachedData = JSON.parse(rawData);
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
async function cachelayerOne(jsonKey: string, key: string) {
  let cssResult = null;
  let jsonResult = null;

  key += '_L1';
  let cachedData = null;
  const rawData = localStorage.getItem(key);
  if (!rawData) return null;

  cachedData = JSON.parse(rawData);

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

async function extractFile(path: string | null) {
  if (!path) {
    console.warn('DyvixUI: Invalid path');
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
function generateCacheKey(component: string, utility: string) {
  const key = `DYVIX_${VERSION}_${component}_${utility}`;

  return key;
}

interface ThemeConfig {
  theme: string;
  [key: string]: any;
}

async function resolveTheme(
  localTheme: string | null,
  themeName: string,
  component: string
) {
  if (localTheme) return localTheme;

  const rawGlobalThemes = await extractFile('../../themeRegistry/themes.json');

  const globalThemes: ThemeConfig[] =
    typeof rawGlobalThemes === 'string'
      ? JSON.parse(rawGlobalThemes)
      : rawGlobalThemes;

  if (!Array.isArray(globalThemes)) return null;

  const theme = globalThemes.find((e) => e.theme === themeName);

  if (!theme) return null;

  return {
    ...theme,
    class: `dyvix-${component.toLowerCase()}-${themeName.toLowerCase()}`
  };
}

async function extractCSSClass(
  classname: string | undefined | null,
  Csspath: string | null | undefined,
  cssblock: string | null | undefined
) {
  if (!classname) return null;

  let rawCSS: string | null = null;
  if (Csspath) {
    rawCSS = await extractFile(Csspath);
  } else if (cssblock) {
    rawCSS = cssblock;
  } else {
    return null;
  }
  if (!rawCSS) {
    return null;
  }

  const lines = rawCSS!.replace(/\s+/g, ' ').trim().split('}');
  let block = '';
  const matches = lines
    .filter((val) => val.trim().includes(classname))
    .map((block) => block.trim() + '}');
  block = matches.join('\n\n');

  return block;
}

function InjectCSS(
  csstext: string,
  Key: string,
  instance: string | number | null
) {
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

interface CacheMapperItem {
  jsonpath?: string | null;
  csspath?: string | null;
  jsonfield?: string | null;
  [key: string]: any;
}

type CacheMapType = Record<string, CacheMapperItem>;
type ValidateAndLoadJSON = {
  status: boolean;
  config: Record<string, any>;
};

export type StateSetter = (
  updater: (prev: Record<string, any>) => Record<string, any>
) => void;

export async function ValidatAndLoadJSON(
  cacheMap: CacheMapType,
  key: string,
  callback: StateSetter,
  utilityKey: string,
  component: string,
  instance: string | number | null = null
): Promise<ValidateAndLoadJSON> {
  if (!cacheMap || !cacheMap[utilityKey]) return { config: {}, status: false };

  const mapper = cacheMap[utilityKey];
  let type = mapper?.csspath ? CACHETYPE.CSS : CACHETYPE.Default;
  const res = await SJCManager(
    mapper['jsonpath'] ?? null,
    mapper['csspath'] ?? null,
    type,
    component,
    utilityKey,
    key,
    'class',
    instance,
    mapper['jsonfield'] ?? null
  );
  callback((prev: Record<string, any>) => {
    if (prev[utilityKey] === res) return prev;
    return { ...prev, [utilityKey]: res };
  });

  return { config: { [utilityKey]: res }, status: res !== null };
}
