import {
  EvaluateFailure,
  GuardStatus,
  allowsNull
} from '../../utils/DyvixGuard';
import { ValidateAndLoadJSON } from '../../utils/Smart Json Caching/SJCManager';

const component = 'Input';
const CacheMapping = {
  theme: {
    jsonpath: '../../components/input/dependencies/themes.json',
    csspath: '../../components/input/dependencies/style/themes.css'
  },
  type: {
    jsonpath: '../../components/input/dependencies/types.json',
    csspath: null
  },
  animation: {
    jsonpath: '../../components/animations.json',
    csspath: null
  }
};

export async function Validateinput(
  animation,
  theme,
  type,
  callback,
  instance
) {
  let normalizedAnimation = animation?.trim().toLowerCase();
  let normalizedType = type?.trim().toLowerCase();
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
  const [isAnimation, isType] = await Promise.all([
    ValidateAndLoadJSON(
      CacheMapping,
      normalizedAnimation,
      callback,
      'animation',
      component
    ),
    ValidateAndLoadJSON(
      CacheMapping,
      normalizedType,
      callback,
      'type',
      component
    )
  ]);

  if (!isAnimation.status && !allowsNull(normalizedAnimation)) {
    return {
      status: GuardStatus.Error,
      error: 'Please provide a valid animation.'
    };
  }
  if (!isType.status && !allowsNull(normalizedType)) {
    return {
      status: GuardStatus.Error,
      error: 'Please provide a valid type.'
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
