import { GuardStatus, allowsNull } from '../../utils/DyvixGuard';
import { ValidateAndLoadJSON } from '../../utils/Smart Json Caching/SJCManager';
import type { StateSetter } from '../../utils/Smart Json Caching/SJCManager';
import type { DyvixContextMenuAnimation } from './dependencies/context-menu.types';
const component = 'Button';
const CacheMapping = {
  theme: {
    jsonpath: '../../components/button/dependencies/themes.json',
    csspath: '../../components/button/dependencies/style/themes.css'
  },
  animation: {
    jsonpath: '../../registry/animations.json',
    csspath: null
  }
};

export async function ValidateContextMenu(
  animation: DyvixContextMenuAnimation | null | undefined,
  callback: StateSetter
) {
  let normalizedAnimation = animation?.trim().toLowerCase() || '';

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
