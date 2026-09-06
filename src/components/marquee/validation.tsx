import type { ReactNode } from 'react';
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
  DyvixConfigItemsProps,
  DyvixMarqueeAnimation
} from '../../components/marquee/dependencies/marquee.types';

const component = 'Marquee';
const CacheMapping = {
  animation: {
    jsonpath: '../../registry/animations.json',
    csspath: null
  },
  theme: {
    jsonpath: '../../components/marquee/dependencies/themes.json',
    csspath: '../../components/marquee/dependencies/style/themes.css'
  }
};

export async function ValidateMarquee(
  animation: string | null,
  theme: string | null | undefined,
  children: ReactNode,
  items: DyvixConfigItemsProps[] | undefined,
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
  if (!children) {
    // Validate marquee items when the user is using table config-mode.

    if (!Array.isArray(items) || items.length === 0) {
      return {
        status: GuardStatus.Error,
        error: 'items prop must be a valid array.'
      };
    }
    const isMalformed = items.some(
      (col) =>
        typeof col !== 'object' ||
        col === null ||
        col.label === undefined ||
        (col.href !== undefined && typeof col.href !== 'string')
    );

    if (isMalformed) {
      return {
        status: GuardStatus.Error,
        error: 'All column entries must be objects containing a label.'
      };
    }
  }
  return { status: GuardStatus.Success };
}
