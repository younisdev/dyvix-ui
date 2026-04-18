import { EvaluateFailure, GaurdStatus} from "../DyvixGuard";
import Version from "../../../package.json"

export const CACHETYPE = { CSS: 'css', ANIMATION: 'animation' };
const VERSION = Version['version'];

export async function cachelayerThree(jsonpath, csspath, type) {
  const key = generateCacheKey(3, "Modal", "theme");

  if(!localStorage.getItem(key)) return true;

  let rawJSON = await extractFile(jsonpath);;
  let rawCSS = null;

  if (type === CACHETYPE.CSS) {
    rawCSS = await extractFile(csspath);
  }

  let value = {
    ...(rawCSS !== null && {"CSS": rawCSS}),
    ...(rawJSON !== null && {"JSON": JSON.stringify(rawJSON)}),
  };

  localStorage.setItem(key, JSON.stringify(value));

  return true;
}


async function extractFile(path)
{
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

export function cachelayerOne(type, classname = 'None', jsonpath) {
  extractCSSClass(
    'dyvix-modal-ember',
    '../../components/modal/dependencies/style/themes.css'
  );
  if (type === CACHETYPE.CSS) {
  }
}

async function extractCSSClass(classname, Csspath) {
  try {
    const module = await import(/* @vite-ignore */ `${Csspath}?raw`);
    const rawCSS = module.default || module;
    const lines = rawCSS.replace(/\s+/g, ' ').trim().split('}');
    let block = '';
    const matches = lines
      .filter((val) => val.trim().includes(classname))
      .map((block) => block.trim() + '}');
    block = matches.join('\n\n');

    return block;
  } catch (error) {
    console.log('DyvixUI Sys error');
  }
}
