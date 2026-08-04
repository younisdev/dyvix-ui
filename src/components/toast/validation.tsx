import {
  ValidateAndLoadJSON,
  type StateSetter
} from '../../utils/Smart Json Caching/SJCManager';
import {
  EvaluateFailure,
  GuardStatus,
  allowsNull
} from '../../utils/DyvixGuard';
import type {
  DyvixToastAnimation,
  DyvixToastPosition,
  DyvixToastType
} from './dependencies/toast.types';

const component = 'Toast';
const CacheMapping = {
  animation: {
    jsonpath: '../../registry/animations.json',
    csspath: null
  },
  position: {
    jsonpath: '../../components/toast/dependencies/positions.json',
    csspath: null
  },
  type: {
    jsonpath: '../../components/toast/dependencies/types.json',
    csspath: null
  }
};

export async function ValidateContainer(
  position: DyvixToastPosition | null | undefined,
  segments: number,
  duration: number,
  animation: DyvixToastAnimation | null | undefined,
  callback: StateSetter,
  instance: any
) {
  let normalizedAnimation = animation?.trim().toLowerCase() || '';
  let normalizedPosition = position?.trim().toLowerCase() || '';

  const [isAnimation, isPosition] = await Promise.all([
    ValidateAndLoadJSON(
      CacheMapping,
      normalizedAnimation,
      callback,
      'animation',
      component
    ),
    ValidateAndLoadJSON(
      CacheMapping,
      normalizedPosition,
      callback,
      'position',
      component
    )
  ]);
  if (
    normalizedAnimation &&
    !isAnimation.status &&
    !allowsNull(normalizedAnimation)
  ) {
    return {
      status: GuardStatus.Error,
      error: 'Please provide a valid animation.'
    };
  }
  if (
    normalizedPosition &&
    !isPosition.status &&
    !allowsNull(normalizedPosition)
  ) {
    return {
      status: GuardStatus.Error,
      error: 'Please provide a valid position.'
    };
  }
  if (typeof duration !== 'number' || duration <= 0) {
    return {
      status: GuardStatus.Error,
      error: 'Please provide a valid duration that is greater than 0.'
    };
  }
  if (segments <= 0 || segments > 10) {
    return {
      status: GuardStatus.Error,
      error: 'Please provide a segment between 1 and 10.'
    };
  }

  return { status: GuardStatus.Success };
}

export async function ValidateToast(
  type: DyvixToastType | null | undefined,
  callback: StateSetter,
  instance: any
) {
  let normalizedType = type?.trim() || '';
  const isType = await ValidateAndLoadJSON(
    CacheMapping,
    normalizedType,
    callback,
    'type',
    component
  );

  if (!(isType as any).status && !allowsNull(normalizedType)) {
    return {
      status: GuardStatus.Error,
      error: 'Please provide a valid toast type.'
    };
  }

  return { status: GuardStatus.Success };
}
