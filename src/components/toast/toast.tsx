import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { DyvixToast } from './dependencies/toast.types';
import { GuardStatus, EvaluateFailure } from '../../utils/DyvixGuard';
import { ValidateToast } from './validation';
import { ConstructClasses } from '../../utils/utils';

const DyvixToastItem: React.FC<DyvixToast> = ({
  className,
  message,
  animation,
  type,
  onClose,
  duration = 5000
}) => {
  const toastRef = React.useRef(null);
  const [configs, SetConfig] = React.useState({});
  const instanceId = React.useId();
  const [status, SetStatus] = React.useState('entering');
  const icons: Record<string, any> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'i'
  };
  const currentAnimation = animation || null;
  const currentType = type ? (configs as any)['type'] : null;
  useGSAP(() => {
    if (!toastRef.current || !currentAnimation) return;
    const tl = gsap.timeline();

    if (status === 'entering') {
      tl.fromTo(toastRef.current, currentAnimation.from, {
        ...currentAnimation.to,
        duration: currentAnimation['default-duration'],
        ease: currentAnimation.ease,
        onComplete: () => SetStatus('active')
      });
    } else if (status === 'leaving') {
      tl.fromTo(toastRef.current, currentAnimation.to, {
        ...currentAnimation.from,
        duration: currentAnimation['default-duration'],
        delay: Math.random() * 0.3,
        ease: currentAnimation.ease,
        onComplete: onClose
      });
    }
  }, [status]);

  React.useEffect(() => {
    let timer: number;

    if (status === 'active') {
      timer = setTimeout(() => {
        SetStatus('leaving');
      }, duration);
    }

    return () => clearTimeout(timer);
  }, [status]);
  React.useEffect(() => {
    async function validate() {
      const validator = await ValidateToast(type, SetConfig, instanceId);

      if (validator.status === GuardStatus.Error) {
        return EvaluateFailure(validator.error, validator.status);
      }
    }

    validate();
  }, [type]);

  return (
    <div
      className={ConstructClasses(className, currentType?.class)}
      ref={toastRef}
    >
      <span className={`dyvix-toast-title toast-${type.toLowerCase()}`}>
        <span className="dyvix-toast-icon">{icons[type.toLowerCase()]}</span>{' '}
        {type}
      </span>
      <span className="dyvix-toast-content">{message}</span>
    </div>
  );
};

export default DyvixToastItem;
