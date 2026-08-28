import React from 'react';
import './dependencies/style/style.css';
import { EvaluateFailure, GuardStatus } from '../../utils/DyvixGuard';
import { Validatelbl } from './validation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Version from '../../../package.json';
import type { DyvixLabelProps } from './dependencies/label.types';
import { ConstructClasses, SmartPropsSplitting } from '../../utils/utils';

const DyvixLabel = React.forwardRef<HTMLDivElement, DyvixLabelProps>(
  (
    {
      children,
      className,
      htmlFor,
      animation = 'fade',
      overrides,
      theme,
      background,
      color,
      style,
      timeline,
      ...rest
    },
    ref
  ) => {
    const internalRef = React.useRef<HTMLDivElement | null>(null);
    const addedToTimeLineRef = React.useRef<{
      theme: string | null;
      animation: string | null;
    } | null>(null);

    React.useImperativeHandle(ref, () => internalRef.current as HTMLDivElement);
    const [configs, SetConfig] = React.useState({});
    const { wrapperProps, elementProps } = SmartPropsSplitting({
      style,
      ...rest
    });
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

    useGSAP(
      () => {
        if (!internalRef.current || !currentAnimation) return;

        const toVars: GSAPTweenVars = {
          ...currentAnimation.to,
          duration: currentAnimation['default-duration'],
          ease: currentAnimation.ease
        };

        if (timeline) {
          if (
            addedToTimeLineRef.current?.theme === theme &&
            addedToTimeLineRef.current?.animation === animation
          )
            return;

          timeline.fromTo(internalRef.current, currentAnimation.from, toVars);
          addedToTimeLineRef.current = {
            theme: theme || null,
            animation: animation || null
          };
        } else {
          gsap.fromTo(internalRef.current, currentAnimation.from, toVars);
        }
      },
      { scope: internalRef, dependencies: [currentAnimation] }
    );

    const { style: splitElementStyles, ...restElementProps } = elementProps;
    const props = {
      ...restElementProps,
      className: ConstructClasses(
        'dyvix-label',
        !currentTheme?.class ? 'dyvix-label-default' : '',
        currentTheme?.class,
        className
      ),
      ...(htmlFor && { htmlFor: htmlFor }),
      style: {
        ...(background && { background: background }),
        ...(color && { color: color }),
        ...splitElementStyles
      }
    };

    const combinedWrapperStyle = {
      ...wrapperProps?.style,
      ...overrides
    };

    return (
      <div
        className="dyvix-label-wrapper"
        ref={internalRef}
        {...wrapperProps}
        style={combinedWrapperStyle}
      >
        <label {...props}>{children}</label>
      </div>
    );
  }
);

export default DyvixLabel;
