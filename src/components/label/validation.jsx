import {
  EvaluateFailure,
  GuardStatus,
  allowsNull
} from '../../utils/DyvixGuard';
import { ValidateAndLoadJSON } from '../../utils/Smart Json Caching/SJCManager';

const component = 'Label';
const CacheMapping = {
  theme: {
    jsonpath: '../../components/label/dependencies/themes.json',
    csspath: '../../components/label/dependencies/style/themes.css'
  },
  animation: {
    jsonpath: '../../components/animations.json',
    csspath: null
  }
};

export async function Validatelbl(animation, theme, callback, instance) {
  let normalizedAnimation = animation?.trim().toLowerCase();
  const normalizedTheme =
    theme?.trim().charAt(0).toUpperCase() + theme.trim().slice(1);

  const isTheme = await ValidateAndLoadJSON(
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

  const isAnimation = await ValidateAndLoadJSON(
    CacheMapping,
    normalizedAnimation,
    callback,
    'animation',
    component
  );
  if (!isAnimation.status && !allowsNull(normalizedAnimation)) {
    return {
      status: GuardStatus.Error,
      error: 'Please provide a valid animation.'
    };
  }

  return { status: GuardStatus.Success };
}
