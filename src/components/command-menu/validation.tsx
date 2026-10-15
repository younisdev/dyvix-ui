import { GuardStatus, allowsNull } from '../../utils/DyvixGuard';
import { ValidateAndLoadJSON } from '../../utils/Smart Json Caching/SJCManager';
import type { StateSetter } from '../../utils/Smart Json Caching/SJCManager';
import type { DyvixCommandMenuAnimation } from './dependencies/command-menu.types';

const component = 'command-menu';
const CacheMapping = {
  animation: {
    jsonpath: '../../registry/animations.json',
    csspath: null
  }
};

export async function ValidateCommandMenu(
  animation: DyvixCommandMenuAnimation | null | undefined,
  callback: StateSetter,
  instance: any
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
