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
  DyvixFileAnimation,
  DyvixFileThemes
} from './dependencies/file.types';

const component = 'File';
const CacheMapping = {
  theme: {
    jsonpath: '../../components/file/dependencies/themes.json',
    csspath: '../../components/file/dependencies/style/themes.css'
  },
  animation: {
    jsonpath: '../../registry/animations.json',
    csspath: null
  }
};

export async function Validatefile(
  animation: DyvixFileAnimation | null | undefined,
  theme: DyvixFileThemes | null | undefined,
  callback: StateSetter,
  instance: any
) {
  let normalizedAnimation = animation?.trim().toLowerCase() || '';
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
