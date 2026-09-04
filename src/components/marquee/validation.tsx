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

const component = 'marquee';
const CacheMapping = {
  animation: {
    jsonpath: '../../registry/animations.json',
    csspath: null
  }
};

export async function ValidateMarquee(
  animation: string | null,
  children: ReactNode,
  items: DyvixConfigItemsProps[] | undefined,
  callback: StateSetter,
  instance: number | string
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
