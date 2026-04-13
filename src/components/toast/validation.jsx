import {
  EvaluateFailure,
  GaurdStatus,
  allowsNull
} from '../../utils/DyvixGuard';
import { validPositions, validAnimations, validTypes } from './toastContainer';

export function ValidateContainer(position, segments, duration, animation) {
  if (!validPositions.includes(position)) {
    return {
      status: GaurdStatus.Error,
      error: 'Please provide a valid position.'
    };
  }
  if (typeof duration !== 'number' || duration <= 0) {
    return {
      status: GaurdStatus.Error,
      error: 'Please provide a valid duration that is greater than 0.'
    };
  }
  if (!validAnimations.includes(animation)) {
    return {
      status: GaurdStatus.Error,
      error: 'Please provide a valid animation.'
    };
  }
  if(segments <= 0 || segments > 10)
  {
    return {
      status: GaurdStatus.Error,
      error: 'Please provide a segment between 1 and 10.'
    };
  }

  return { status: GaurdStatus.Success };
}
