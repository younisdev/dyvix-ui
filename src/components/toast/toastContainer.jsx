import './dependencies/style/style.css';
import positionData from './dependencies/positions.json';
import TypesData from './dependencies/types.json';
import animationsData from '../animations.json';
import React from 'react';
import { subscribe } from './bus';
import { DyvixToastItem } from './toast';
import { ValidateContainer } from './validation';
import { GaurdStatus, EvaluateFailure } from '../../utils/DyvixGuard';

export const validPositions = positionData.map((e) => e.position);
export const validTypes = TypesData.map((e) => e.type);
export const validAnimations = animationsData.map((e) => e.animation);

function DyvixToastContainer({
  position = 'top-right',
  segments = 10,
  duration = 5000,
  animation = 'zoom'
}) {
  const validator = ValidateContainer(position, segments, duration, animation);

  if (validator.status === GaurdStatus.Error) {
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
            Class={currentclass}
            duration={duration}
            animation={animation}
            type={currentType.type}
          />
        );
      })}
    </div>
  );
}

export default DyvixToastContainer;
