import {
  EvaluateFailure,
  GuardStatus,
  allowsNull
} from '../../utils/DyvixGuard';
import { ValidatAndLoadJSON } from '../../utils/Smart Json Caching/SJCManager';

const component = 'Tooltip';
const CacheMapping = {
  theme: {
    jsonpath: '../../components/tooltip/dependencies/themes.json',
    csspath: '../../components/tooltip/dependencies/style/themes.css'
  },
  animation: {
    jsonpath: '../../components/animations.json',
    csspath: null
  }
};

export async function ValidateTooltip(animation, theme, callback, instance) {
  let normalizedAnimation = animation?.trim().toLowerCase();
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
      status: GuardStatus.Error,
      error: 'Please provide a valid animation.'
    };
  }
  if (normalizedTheme !== '!/' && !isTheme.status) {
    return {
      status: GuardStatus.Error,
      error: 'Please provide a valid theme.'
    };
  }

  return { status: GuardStatus.Success };
}
