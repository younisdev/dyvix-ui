import {
  EvaluateFailure,
  GaurdStatus,
  allowsNull
} from '../../utils/DyvixGuard';
import { ValidatAndLoadJSON } from '../../utils/Smart Json Caching/SJCManager';

const component = 'File';
const CacheMapping = {
  theme: {
    jsonpath: '../../components/file/dependencies/themes.json',
    csspath: '../../components/file/dependencies/style/themes.css'
  },
  animation: {
    jsonpath: '../../components/animations.json',
    csspath: null
  }
};

export async function Validatefile(animation, theme, callback, instance) {
  let normalizedAnimation = animation?.trim().toLowerCase();
  console.log(theme)
  const normalizedTheme =
    theme?.trim().charAt(0).toUpperCase() + theme.trim().slice(1);

  const isTheme = await ValidatAndLoadJSON(
    CacheMapping,
    normalizedTheme,
    callback,
    'theme',
    component,
    instance
  );
  if (normalizedAnimation === '!/' && isTheme?.config?.theme) {
    normalizedAnimation = isTheme?.config?.theme['default-animation'];
  }

  const isAnimation = await ValidatAndLoadJSON(
    CacheMapping,
    normalizedAnimation,
    callback,
    'animation',
    component
  );
  if (!isAnimation.status && !allowsNull(normalizedAnimation)) {
    return {
      status: GaurdStatus.Error,
      error: 'Please provide a valid animation.'
    };
  }

  if (normalizedTheme !== '!/' && !isTheme.status) {
    return {
      status: GaurdStatus.Error,
      error: 'Please provide a valid theme.'
    };
  }

  return { status: GaurdStatus.Success };
}
