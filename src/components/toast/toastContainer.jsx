import './dependencies/style/style.css';
import './dependencies/style/positions.css';
import './dependencies/style/animations.css';
import positionData from './dependencies/positions.json';
import TypesData from './dependencies/types.json';
import animationsData from '../animations.json';
import React from 'react';
import { subscribe } from './bus';
import { DyvixToastItem } from './toast';
import { ValidateContainer } from './validation';
import { GuardStatus, EvaluateFailure } from '../../utils/DyvixGuard';

export const validPositions = positionData.map((e) => e.position);
export const validTypes = TypesData.map((e) => e.type);
export const validAnimations = animationsData.map((e) => e.animation);

/**
 * @param {Object} props
 * @param {'top-left'|'top-right'|'top-center'|'bottom-left'|'bottom-right'|'bottom-center'} props.position - Toast postion
 * @param {number} props.segments - The max amount of toast at a time
 * @param {number} props.duration - The duration to show the toast for in mile seconds.
 * @param {string} [props.animation] - Animation name, defaults to zoom
 * @param {boolean} [props.cssAnimation] - Use pure CSS animations instead of GSAP (default: true)
 */
function DyvixToastContainer({
  position = 'top-right',
  segments = 10,
  duration = 5000,
  animation = 'zoom',
  cssAnimation = true
}) {
  const validator = ValidateContainer(position, segments, duration, animation);

  if (validator.status === GuardStatus.Error) {
    return EvaluateFailure(validator.error, validator.status);
  }

  const [toasts, setToasts] = React.useState([]);
  const currentPosition = positionData.find(
    (e) => e.position.trim().toLowerCase() === position.trim().toLowerCase()
  );

  React.useEffect(() => {
    const unsub = subscribe((newToast) => {
      setToasts((prev) => {
        const next = [...prev, { ...newToast, id: crypto.randomUUID() }];
        return next;
      });
    });
    return unsub;
  }, []);

  return (
    <div className={`dyvix-toast-container ${currentPosition.class}`}>
      {toasts.slice(0, segments).map((toast, i) => {
        const currentType = TypesData.find(
          (e) => e.type.trim().toLowerCase() === toast.type.trim().toLowerCase()
        );
        const currentclass = `dyvix-toast ${currentType.class}`;

        return (
          <DyvixToastItem
            key={toast.id}
            message={toast.message}
            onClose={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
            className={currentclass}
            duration={duration}
            animation={cssAnimation ? null : animation}
            cssAnimation={cssAnimation}
            type={currentType.type}
          />
        );
      })}
    </div>
  );
}

export default DyvixToastContainer;
