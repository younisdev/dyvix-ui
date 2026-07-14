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
  duration = 5000,
  cssAnimation = false
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

  const durationSec = duration / 1000;

  useGSAP(() => {
    if (cssAnimation || !toastRef.current || !currentAnimation) return;
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

    if (status === 'active' || (cssAnimation && status === 'entering')) {
      timer = setTimeout(() => {
        if (cssAnimation) {
          SetStatus('leaving');
        } else {
          SetStatus('leaving');
        }
      }, duration);
    }

    return () => clearTimeout(timer);
  }, [status, cssAnimation]);

  // CSS animation mode: handle exit animation then call onClose
  React.useEffect(() => {
    if (!cssAnimation || status !== 'leaving' || !toastRef.current) return;

    const handleAnimationEnd = () => {
      if (typeof onClose === 'function') onClose();
    };

    const el = toastRef.current;
    el.addEventListener('animationend', handleAnimationEnd);
    return () => el.removeEventListener('animationend', handleAnimationEnd);
  }, [status, cssAnimation]);

  // Determine CSS animation classes
  const getEntryClass = () => {
    if (!cssAnimation) return '';
    // Infer entry direction from container class
    const container = toastRef.current?.closest('.dyvix-toast-container');
    if (!container) return 'dyvix-toast--slide-in-right';
    if (container.classList.contains('dyvix-top-right') || container.classList.contains('dyvix-bottom-right'))
      return 'dyvix-toast--slide-in-right';
    if (container.classList.contains('dyvix-top-left') || container.classList.contains('dyvix-bottom-left'))
      return 'dyvix-toast--slide-in-left';
    if (container.classList.contains('dyvix-top-center'))
      return 'dyvix-toast--slide-in-down';
    if (container.classList.contains('dyvix-bottom-center'))
      return 'dyvix-toast--slide-in-up';
    return 'dyvix-toast--slide-in-right';
  };

  const getExitClass = () => {
    if (!cssAnimation) return '';
    const container = toastRef.current?.closest('.dyvix-toast-container');
    if (!container) return 'dyvix-toast--fade-out';
    if (container.classList.contains('dyvix-top-right') || container.classList.contains('dyvix-bottom-right'))
      return 'dyvix-toast--slide-out-right';
    if (container.classList.contains('dyvix-top-left') || container.classList.contains('dyvix-bottom-left'))
      return 'dyvix-toast--slide-out-left';
    if (container.classList.contains('dyvix-top-center'))
      return 'dyvix-toast--slide-out-up';
    if (container.classList.contains('dyvix-bottom-center'))
      return 'dyvix-toast--slide-out-down';
    return 'dyvix-toast--fade-out';
  };

  const cssAnimClass = cssAnimation
    ? status === 'entering'
      ? getEntryClass()
      : status === 'leaving'
        ? getExitClass()
        : ''
    : '';

  const typeLower = type.toLowerCase();
  const progressBarClass = `dyvix-toast-progress dyvix-toast-progress--${typeLower}`;

  return (
    <div
      className={`${className} ${cssAnimClass}`}
      ref={toastRef}
      style={cssAnimation && status === 'entering' ? { animationDuration: `${durationSec}s` } : undefined}
    >
      <button
        className="dyvix-toast-close"
        onClick={() => {
          if (cssAnimation) {
            SetStatus('leaving');
          } else {
            SetStatus('leaving');
          }
        }}
        aria-label="Close notification"
      >
        ✕
      </button>
      <span className={`dyvix-toast-title toast-${typeLower}`}>
        <span className="dyvix-toast-icon">{icons[typeLower]}</span>{' '}
        {type}
      </span>
      <span className="dyvix-toast-content">{message}</span>
      {cssAnimation && (status === 'entering' || status === 'active') && (
        <div
          className={progressBarClass}
          style={{ animationDuration: `${durationSec}s` }}
        />
      )}
    </div>
  );
}
