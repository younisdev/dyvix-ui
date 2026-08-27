import React from 'react';
import './dependencies/style/style.css';
import { EvaluateFailure, GuardStatus } from '../../utils/DyvixGuard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Validatebtn } from './validation';
import Version from '../../../package.json';
import type { DyvixButtonProps } from './dependencies/button.types';
import { ConstructClasses, SmartPropsSplitting } from '../../utils/utils';

const DyvixButton = React.forwardRef<HTMLDivElement, DyvixButtonProps>(
  (
    {
      children,
      animation,
      overrides,
      className,
      theme,
      background,
      color,
      onClick,
      style,
      ...rest
    },
    ref
  ) => {
    const internalRef = React.useRef<HTMLDivElement | null>(null);

    React.useImperativeHandle(ref, () => internalRef.current as HTMLDivElement);

    const [configs, SetConfig] = React.useState({});
    const instanceId = React.useId();
    const { wrapperProps, elementProps } = SmartPropsSplitting({
      style,
      ...rest
    });

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
      if (!internalRef.current || !currentAnimation) return;

      gsap.fromTo(internalRef.current, currentAnimation.from, {
        ...currentAnimation.to,
        duration: currentAnimation['default-duration'],
        ease: currentAnimation.ease
      });
    }, [currentAnimation]);

    const { style: splitElementStyles, ...restElementProps } = elementProps;
    const props = {
      ...restElementProps,
      className: ConstructClasses(
        'dyvix-button',
        !currentTheme?.class ? 'dyvix-button-default' : '',
        currentTheme?.class,
        className
      ),
      style: {
        ...(background && { background: background }),
        ...(color && { color: color }),
        ...splitElementStyles
      }
    };

    const combinedWrapperStyle = {
      ...wrapperProps.style,
      ...overrides
    };

    return (
      <div
        className="dyvix-button-wrapper"
        ref={internalRef}
        {...wrapperProps}
        style={combinedWrapperStyle}
      >
        <button {...props} onClick={handleClick}>
          {children}
        </button>
      </div>
    );
  }
);
export default DyvixButton;
