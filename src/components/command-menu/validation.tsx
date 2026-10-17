import { GuardStatus, allowsNull } from '../../utils/DyvixGuard';
import { ValidateAndLoadJSON } from '../../utils/Smart Json Caching/SJCManager';
import type { StateSetter } from '../../utils/Smart Json Caching/SJCManager';
import type {
  DyvixCommandMenuAnimation,
  DyvixCommandMenuThemes
} from './dependencies/command-menu.types';

const component = 'command-menu';
const CacheMapping = {
  theme: {
    jsonpath: '../../components/command-menu/dependencies/themes.json',
    csspath: '../../components/command-menu/dependencies/style/themes.css'
  },
  animation: {
    jsonpath: '../../registry/animations.json',
    csspath: null
  }
};

export async function ValidateCommandMenu(
  animation: DyvixCommandMenuAnimation | null | undefined,
  theme: DyvixCommandMenuThemes | null | undefined,
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

  return { status: GuardStatus.Success };
}
