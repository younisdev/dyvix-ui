import './dependencies/style/style.css';
import './dependencies/style/positions.css';
import React from 'react';
import { subscribe } from './bus';
import DyvixToastItem from './toast';
import { ValidateContainer } from './validation';
import { GuardStatus, EvaluateFailure } from '../../utils/DyvixGuard';
import type {
  DyvixToastContainerProps,
  DyvixToastType,
  ToastItem
} from './dependencies/toast.types';
import { ConstructClasses } from '../../utils/utils';

const DyvixToastContainer: React.FC<DyvixToastContainerProps> = ({
  position = 'top-right',
  segments = 10,
  duration = 5000,
  animation = 'zoom'
}) => {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const [configs, SetConfig] = React.useState({});
  const instanceId = React.useId();
  const currentPosition = position ? (configs as any)['position'] : null;
  const currentAnimation = animation ? (configs as any)['animation'] : null;

  React.useEffect(() => {
    const unsub = subscribe((newToast: ToastItem) => {
      setToasts((prev) => {
        const next = [...prev, { ...newToast, id: crypto.randomUUID() }];
        return next;
      });
    });
    return () => {
      unsub();
    };
  }, []);
  React.useEffect(() => {
    async function validate() {
      const validator = await ValidateContainer(
        position,
        segments,
        duration,
        animation,
        SetConfig,
        instanceId
      );

      if (validator.status === GuardStatus.Error) {
        return EvaluateFailure(validator.error, validator.status);
      }
    }

    validate();
  }, [animation, position, segments, duration]);

  return (
    <div
      className={ConstructClasses(
        'dyvix-toast-container',
        currentPosition?.class
      )}
    >
      {toasts.slice(0, segments).map((toast, i) => {
        return (
          <DyvixToastItem
            key={toast.id}
            message={toast.message}
            onClose={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
            className={'dyvix-toast'}
            duration={duration}
            animation={currentAnimation}
            type={toast.type as DyvixToastType}
          />
        );
      })}
    </div>
  );
};

export default DyvixToastContainer;
