import {
  EvaluateFailure,
  GaurdStatus,
  allowsNull
} from '../../utils/DyvixGuard';
import { ValidatAndLoadJSON } from '../../utils/Smart Json Caching/SJCManager';

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
    jsonpath: '../../components/animations.json',
    csspath: null
  }
};

export async function Validateinput(animation, theme, type, callback, instance) {
  let normalizedAnimation = animation?.trim().toLowerCase();
  let normalizedType = type?.trim().toLowerCase();

  const [isAnimation, isType] = await Promise.all([
    ValidatAndLoadJSON(
      CacheMapping,
      normalizedAnimation,
      callback,
      'animation',
      component
    ),
    ValidatAndLoadJSON(CacheMapping, normalizedType, callback, 'type', component)
  ]);

  if (!isAnimation.status && !allowsNull(normalizedAnimation)) {
    return {
      status: GaurdStatus.Error,
      error: 'Please provide a valid animation.'
    };
  }
  if (!isType.status && !allowsNull(normalizedType)) {
    return {
      status: GaurdStatus.Error,
      error: 'Please provide a valid type.'
    };
  }

  return { status: GaurdStatus.Success };
}
