import React from 'react';
import './dependencies/style/style.css';
import './dependencies/style/themes.css';
import positionsData from './dependencies/positions.json';
import { EvaluateFailure, GuardStatus } from '../../utils/DyvixGuard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ValidateTooltip } from './validation';
import Version from '../../../package.json';

export const validPositions = positionsData.map((e) => e.position);

/**
 * @param {Object} props
 * @param {string} props.content - Tooltip text content
 * @param {'top'|'bottom'|'left'|'right'} [props.position] - Tooltip position (default: 'top')
 * @param {('shimmer'|'pulse'|'wave'|'fade'|'bounce')} [props.animationType] - CSS animation type on hover
 * @param {string} [props.animation] - GSAP animation name for the wrapper
 * @param {('Singularity'|'Industrial'|'Ember'|'Frost'|'Blade'|'Neon'|'Aurora'|'Sunset'|'Ocean'|'Forest'|'Midnight'|'Crimson'|'Obsidian'|'Coffee'|'Cosmos')} [props.theme] - Tooltip theme
 * @param {string} [props.className] - Additional className
 * @param {boolean} [props.multiline] - Allow multi-line tooltip text
 * @param {'short'|'medium'|'long'} [props.delay] - Hover delay before showing
 * @param {Object} [props.style] - Inline style overrides
 */
function DyvixTooltip({
  children,
  content,
  position = 'top',
  animationType = 'fade',
  animation = '!/',
  theme = '!/',
  className = '',
  multiline = false,
  delay,
  style,
  ...rest
}) {
  const wrapperRef = React.useRef(null);
  const [configs, SetConfig] = React.useState({});
  const instanceId = React.useId();

  const currentTheme = configs['theme'];
  const currentAnimation = animation ? configs['animation'] : null;

  const currentPosition = positionsData.find(
    (e) => e.position.trim().toLowerCase() === position.trim().toLowerCase()
  );

  if (!currentPosition) {
    return EvaluateFailure(
      `Invalid tooltip position: "${position}". Valid positions: ${validPositions.join(', ')}`,
      GuardStatus.Error
    );
  }

  React.useEffect(() => {
    async function validate() {
      const validator = await ValidateTooltip(
        animation,
        theme,
        SetConfig,
        instanceId
      );

      if (validator.status === GuardStatus.Error) {
        return EvaluateFailure(validator.error, validator.status);
      }
    }

    validate();
    return () => {
      const key = `DYVIX_${Version['version']}_Tooltip_theme_${instanceId}`;
      const ele = document.getElementById(key);
      if (ele) ele.remove();
    };
  }, [theme, animation]);

  useGSAP(() => {
    if (!wrapperRef.current || !currentAnimation) return;

    gsap.fromTo(wrapperRef.current, currentAnimation.from, {
      ...currentAnimation.to,
      duration: currentAnimation['default-duration'],
      ease: currentAnimation.ease
    });
  }, [currentAnimation]);

  const animClass =
    animationType === 'bounce'
      ? 'dyvix-tooltip--bounce'
      : animationType === 'fade'
        ? 'dyvix-tooltip--fade'
        : '';

  const delayClass = delay
    ? delay === 'short'
      ? 'dyvix-tooltip--delay-short'
      : delay === 'medium'
        ? 'dyvix-tooltip--delay-medium'
        : delay === 'long'
          ? 'dyvix-tooltip--delay-long'
          : ''
    : '';

  const multilineClass = multiline ? 'dyvix-tooltip--multiline' : '';

  const tooltipClassName = [
    'dyvix-tooltip',
    currentPosition.class,
    animClass,
    multilineClass,
    currentTheme?.class || '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const wrapperClassName = [
    'dyvix-tooltip-wrapper',
    delayClass
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClassName} ref={wrapperRef} style={style} {...rest}>
      {children}
      <div className={tooltipClassName} role="tooltip">
        {content}
        <span className="dyvix-tooltip-arrow" />
      </div>
    </div>
  );
}

export default DyvixTooltip;
