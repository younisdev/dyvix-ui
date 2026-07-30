import React from 'react';
import './dependencies/style/style.css';
import { EvaluateFailure, GuardStatus } from '../../utils/DyvixGuard';
import { Validatelbl } from './validation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Version from '../../../package.json';
import type { DyvixLabelProps } from './dependencies/label.types';
import { ConstructClasses } from '../../utils/utils';

const DyvixLabel: React.FC<DyvixLabelProps> = ({
  children,
  className,
  htmlFor,
  animation = 'fade',
  theme,
  background,
  color,
  style,
  ...rest
}) => {
  const lblRef = React.useRef(null);
  const [configs, SetConfig] = React.useState({});
  const instanceId = React.useId();
  const currentAnimation = animation ? (configs as any)['animation'] : null;
  const currentTheme = theme ? (configs as any)['theme'] : null;

  React.useEffect(() => {
    async function validate() {
      const validator = await Validatelbl(
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
      const key = `DYVIX_${Version['version']}_Label_theme_${instanceId}`;
      const ele = document.getElementById(key);
      if (ele) ele.remove();
    };
  }, [animation, theme]);

  useGSAP(() => {
    if (!lblRef.current || !currentAnimation) return;

    gsap.fromTo(lblRef.current, currentAnimation.from, {
      ...currentAnimation.to,
      duration: currentAnimation['default-duration'],
      ease: currentAnimation.ease
    });
  }, [currentAnimation]);

  const props = {
    className: ConstructClasses('dyvix-label', currentTheme?.class, className),
    ...(htmlFor && { htmlFor: htmlFor }),
    style: {
      ...(background && { background: background }),
      ...(color && { color: color }),
      ...style
    }
  };

  return (
    <div className="dyvix-label-wrapper" ref={lblRef}>
      <label {...props} {...rest}>
        {children}
      </label>
    </div>
  );
};

export default DyvixLabel;
