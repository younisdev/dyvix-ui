import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './dependencies/style/style.css';
import React from 'react';
import { Validateinput } from './validation';
import Version from '../../../package.json';
import type { DyvixInputProps } from './dependencies/input.types';
import { ConstructClasses, SmartPropsSplitting } from '../../utils/utils';
import { EvaluateFailure, GuardStatus } from '../../utils/DyvixGuard';

const DyvixInput: React.FC<DyvixInputProps> = ({
  type = 'text',
  placeholder,
  autoComplete,
  background,
  color,
  animation = 'fade',
  overrides,
  theme,
  className,
  name,
  id,
  disabled,
  'aria-label': ariaLabel,
  onFocus,
  onBlur,
  onChange,
  onKeyDown,
  onKeyUp,
  style,
  ...rest
}) => {
  const inputRef = React.useRef<HTMLDivElement>(null);
  const [configs, SetConfig] = React.useState({});
  const { wrapperProps, elementProps } = SmartPropsSplitting({
    style,
    ...rest
  });
  const combinedWrapperStyle = {
    ...wrapperProps.style,
    ...overrides
  };
  const instanceId = React.useId();

  React.useEffect(() => {
    async function GetFields() {
      const validator = await Validateinput(
        animation,
        theme,
        type,
        SetConfig,
        instanceId
      );
      if (validator.status === GuardStatus.Error) {
        return EvaluateFailure(validator.error, validator.status);
      }
    }

    GetFields();
    return () => {
      const key = `DYVIX_${Version['version']}_Input_theme_${instanceId}`;
      const ele = document.getElementById(key);
      if (ele) ele.remove();
    };
  }, [type, animation, theme]);

  const currentAnimation = animation ? (configs as any)['animation'] : null;
  const currentType = type ? (configs as any)['type'] : null;
  const currentTheme = theme ? (configs as any)['theme'] : null;

  const inputClasses = ConstructClasses(
    'dyvix-input',
    !currentTheme?.class ? 'dyvix-input-default' : '',
    currentType?.class,
    currentTheme?.class,
    className
  );
  const { style: splitElementStyles, ...restElementProps } = elementProps;

  const props = {
    ...restElementProps,
    className: inputClasses,
    type: currentType?.type,
    ...(placeholder && { placeholder: placeholder }),
    ...(name && { name: name }),
    ...(id && { id: id }),
    ...(autoComplete && { autoComplete: autoComplete }),
    ...(disabled === true && { disabled: true }),
    ...(ariaLabel && { 'aria-label': ariaLabel }),
    style: {
      ...(background && { background: background }),
      ...(color && { color: color }),
      ...splitElementStyles
    }
  };

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    if (typeof onBlur === 'function') {
      onBlur(e);
    }
  }
  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    if (typeof onFocus === 'function') {
      onFocus(e);
    }
  }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (typeof onChange === 'function') {
      onChange(e);
    }
  }
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (typeof onKeyDown === 'function') {
      onKeyDown(e);
    }
  }
  function handleKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (typeof onKeyUp === 'function') {
      onKeyUp(e);
    }
  }

  useGSAP(() => {
    if (!inputRef.current || !currentAnimation) return;

    gsap.fromTo(inputRef.current, currentAnimation.from, {
      ...currentAnimation.to,
      duration: currentAnimation['default-duration'],
      ease: currentAnimation.ease
    });
  }, [currentAnimation]);

  return (
    <div
      className="dyvix-input-wrapper"
      ref={inputRef}
      {...wrapperProps}
      style={combinedWrapperStyle}
    >
      <input
        {...props}
        onFocus={(e) => handleFocus(e)}
        onBlur={(e) => handleBlur(e)}
        onChange={(e) => handleChange(e)}
        onKeyDown={(e) => handleKeyDown(e)}
        onKeyUp={(e) => handleKeyUp(e)}
      ></input>
    </div>
  );
};

export default DyvixInput;
