import type { ReactNode } from 'react';
import { GuardStatus, allowsNull } from '../../utils/DyvixGuard';
import { ValidatAndLoadJSON } from '../../utils/Smart Json Caching/SJCManager';
import type { StateSetter } from '../../utils/Smart Json Caching/SJCManager';

const component = 'Nav';
const CacheMapping = {
  theme: {
    jsonpath: '../../components/nav/dependencies/themes.json',
    csspath: '../../components/nav/dependencies/style/themes.css'
  },
  animation: {
    jsonpath: '../../components/animations.json',
    csspath: null
  },
  microanimation: {
    jsonpath: '../../components/animations.json',
    csspath: null,
    jsonfield: 'animation'
  }
};

export async function ValidateNavigation(
  animation: string | null,
  microanimation: string | null | undefined,
  theme: string | null | undefined,
  children: ReactNode,
  callback: StateSetter,
  instance: any
) {
  let normalizedAnimation = animation?.trim().toLowerCase() || '';
  const trimedTheme = theme?.trim();
  const normalizedTheme = trimedTheme
    ? trimedTheme.charAt(0).toUpperCase() + trimedTheme.slice(1)
    : '';

  const isTheme = await ValidatAndLoadJSON(
    CacheMapping,
    normalizedTheme,
    callback,
    'theme',
    component,
    instance
  );

  if (normalizedAnimation === '!/' && (isTheme as any)?.config?.theme) {
    normalizedAnimation = (isTheme as any)?.config?.theme['default-animation'];
  }
  const isAnimation = await ValidatAndLoadJSON(
    CacheMapping,
    normalizedAnimation,
    callback,
    'animation',
    component
  );

  if (microanimation) {
    let normalizedMicroAnimation = microanimation?.trim().toLowerCase();
    const isMicroAnimation = await ValidatAndLoadJSON(
      CacheMapping,
      normalizedMicroAnimation,
      callback,
      'microanimation',
      component
    );

    if (!isMicroAnimation.status && !allowsNull(microanimation)) {
      return {
        status: GuardStatus.Error,
        error: 'Please provide a valid micro animation.'
      };
    }
  }

  if (!(isAnimation as any).status && !allowsNull(normalizedAnimation)) {
    return {
      status: GuardStatus.Error,
      error: 'Please provide a valid animation.'
    };
  }

  if (normalizedTheme !== undefined && !(isTheme as any).status) {
    return {
      status: GuardStatus.Error,
      error: 'Please provide a valid theme.'
    };
  }
  return { status: GuardStatus.Success };
}
