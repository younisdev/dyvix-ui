import React from 'react';
import './dependencies/style/style.css';
import { EvaluateFailure, GuardStatus } from '../../utils/DyvixGuard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Validatebtn } from './validation';
import Version from '../../../package.json';
import type { DyvixButtonProps } from './dependencies/button.types';
import { ConstructClasses } from '../../utils/utils';

const DyvixButton: React.FC<DyvixButtonProps> = ({
  children,
  animation,
  className,
  theme,
  background,
  color,
  onClick,
  style,
  ...rest
}) => {
  const btnRef = React.useRef<HTMLDivElement>(null);
  const [configs, SetConfig] = React.useState({});
  const instanceId = React.useId();

  const currentTheme = (configs as any)['theme'];
  const currentAnimation = animation ? (configs as any)['animation'] : null;
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (typeof onClick === 'function') {
      onClick(e);
    }
  }

  React.useEffect(() => {
    async function validate() {
      const validator = await Validatebtn(
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
    className: ConstructClasses('dyvix-button', currentTheme?.class, className),
    style: {
      ...(background && { background: background }),
      ...(color && { color: color }),
      ...style
    }
  };

  return (
    <div className="dyvix-btn-wrapper" ref={btnRef}>
      <button {...props} {...rest} onClick={handleClick}>
        {children}
      </button>
    </div>
  );
};

export default DyvixButton;
