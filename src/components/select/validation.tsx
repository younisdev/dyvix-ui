import {
  EvaluateFailure,
  GuardStatus,
  allowsNull
} from '../../utils/DyvixGuard';
import {
  ValidateAndLoadJSON,
  type StateSetter
} from '../../utils/Smart Json Caching/SJCManager';

const component = 'Select';
const CacheMapping = {
  animation: {
    jsonpath: '../../registry/animations.json',
    csspath: null
  },
  theme: {
    jsonpath: '../../components/select/dependencies/themes.json',
    csspath: '../../components/select/dependencies/style/themes.css'
  }
};
const supportedTypes = ['select', 'autocomplete'];

export async function ValidateSelect(
  elements: (string | number)[],
  type: string | undefined,
  animation: string | null,
  theme: string | null | undefined,
  callback: StateSetter,
  instance: number | string
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

  if (normalizedAnimation === '' && (isTheme as any)?.config?.theme) {
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
  if (!Array.isArray(elements)) {
    return {
      status: GuardStatus.Error,
      error: 'Elements should be included as an array.'
    };
  }
  if (!supportedTypes.includes(type || '')) {
    return {
      status: GuardStatus.Error,
      error: 'Please provide a valid select type.'
    };
  }

  return { status: GuardStatus.Success };
}
