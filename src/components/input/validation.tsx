import {
  EvaluateFailure,
  GuardStatus,
  allowsNull
} from '../../utils/DyvixGuard';
import {
  ValidateAndLoadJSON,
  type StateSetter
} from '../../utils/Smart Json Caching/SJCManager';
import type {
  DyvixInputAnimation,
  DyvixInputThemes,
  DyvixInputType
} from './dependencies/input.types';

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
    jsonpath: '../../registry/animations.json',
    csspath: null
  }
};

export async function Validateinput(
  animation: DyvixInputAnimation | null | undefined,
  theme: DyvixInputThemes | null | undefined,
  type: DyvixInputType,
  callback: StateSetter,
  instance: any
) {
  let normalizedAnimation = animation?.trim().toLowerCase() || '';
  let normalizedType = type?.trim().toLowerCase();
  const trimedTheme = theme?.trim();
  const normalizedTheme = trimedTheme
    ? trimedTheme.charAt(0).toUpperCase() + trimedTheme.slice(1)
    : '';
  const isTheme = await ValidateAndLoadJSON(
    CacheMapping,
    normalizedTheme,
    callback,
    'theme',
    component,
    instance
  );

  if (normalizedTheme && isTheme.status && !normalizedAnimation) {
    normalizedAnimation = (isTheme as any)?.config?.theme['default-animation'];
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
  if (
    normalizedTheme &&
    !(isTheme as any).status &&
    !allowsNull(normalizedTheme)
  ) {
    return {
      status: GuardStatus.Error,
      error: 'Please provide a valid theme.'
    };
  }

  return { status: GuardStatus.Success };
}
