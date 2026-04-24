import React from 'react';
import animationsData from '../animations.json';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
export function DyvixToastItem({
  className,
  message,
  animation,
  type,
  onClose,
  duration = 5000
}) {
  const toastRef = React.useRef(null);
  const [status, SetStatus] = React.useState('entering');
  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'i' };
  const currentAnimation = animation
    ? animationsData.find(
        (e) =>
          e.animation.trim().toLowerCase() === animation.trim().toLowerCase()
      )
    : null;

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
    let timer;

    if (status === 'active') {
      timer = setTimeout(() => {
        SetStatus('leaving');
      }, duration);
    }

    return () => clearTimeout(timer);
  }, [status]);

  return (
    <div className={className} ref={toastRef}>
      <span className={`dyvix-toast-title toast-${type.toLowerCase()}`}>
        <span className="dyvix-toast-icon">{icons[type.toLowerCase()]}</span>{' '}
        {type}
      </span>
      <span className="dyvix-toast-content">{message}</span>
    </div>
  );
}
