import React from 'react';
import './dependencies/style/style.css';
import { EvaluateFailure, GaurdStatus } from '../../utils/DyvixGuard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Validatebtn } from './validation';
import Version from '../../../package.json';

/**
  * @param {Object} props 
  * @param {string} [props.animation] - Animation name, defaults to fade 
  * @param {string} [props.className] - Button className
  * @param {('Singularity'|'Industrial'|'Ember'|'Frost'|'Blade'|'Neon'|'Aurora')} props.theme - Modal theme
  * @param {string} [props.background] - Button background color
  * @param {string} [props.color] - Button color
  * @param {Function} [props.onClick] - Click callback
 */
function DyvixButton({
  children = 'Click Me',
  animation = 'fade',
  className = '',
  theme = '!/',
  background,
  color,
  onClick,
  style,
  ...rest
}) {
  const btnRef = React.useRef(null);
  const [configs, SetConfig] = React.useState({});
  const instanceId = React.useId();

  const currentTheme = configs['theme'];
  const currentAnimation = animation ? configs['animation'] : null;

  function handleClick() {
    if (typeof onClick === 'function') {
      onClick();
    }
  }

  className = `dyvix-button${currentTheme ? ` ${currentTheme.class}` : ''}${className !== '' ? ` ${className}` : ''}`;

  React.useEffect(() => {
    async function validate() {
      const validator = await Validatebtn(
        animation,
        theme,
        SetConfig,
        instanceId
      );

      if (validator.status === GaurdStatus.Error) {
        return EvaluateFailure(validator.error, validator.status);
      }
    }

    validate();
    return () => {
      const key = `DYVIX_${Version['version']}_Button_theme_${instanceId}`;
      const ele = document.getElementById(key);
      if (ele) ele.remove();
    };
  }, [theme, animation]);
  useGSAP(() => {
    if (!btnRef.current || !currentAnimation) return;

    gsap.fromTo(btnRef.current, currentAnimation.from, {
      ...currentAnimation.to,
      duration: currentAnimation['default-duration'],
      ease: currentAnimation.ease
    });
  }, [currentAnimation]);

  const props = {
    className: className,
    disabled: rest.disabled,
    style: {
      ...(background && { background: background }),
      ...(color && { color: color }),
      ...style
    }
  };

  return (
    <div className="dyvix-btn-wrapper" ref={btnRef} {...rest}>
      <button {...props} onClick={handleClick}>
        {children}
      </button>
    </div>
  );
}

export default DyvixButton;
