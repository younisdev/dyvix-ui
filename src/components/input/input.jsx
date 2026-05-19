import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Version from '../../../package.json';
import './dependencies/style/style.css';
import React from 'react';
import { Validateinput } from './validation';

function DyvixInput({
  type = 'text',
  placeholder,
  background,
  color,
  animation = '!/',
  className = '',
  onFocus,
  onBlur,
  style,
  onChange,
  
  ...rest
}) {
  const inputRef = React.useRef(null);
  const [configs, SetConfig] = React.useState({});
  const instanceId = React.useId();

  React.useEffect(() => {
    async function GetFields() {
      const data = await Validateinput(
        animation,
        '',
        type,
        SetConfig,
        instanceId
      );
    }

    GetFields();
    return () => {
      const key = `DYVIX_${Version['version']}_Input_theme_${instanceId}`;
      const ele = document.getElementById(key);
      if (ele) ele.remove();
    };
  }, [type, animation]);

  const currentAnimation = animation ? configs['animation'] : null;
  const currentType = type ? configs['type'] : null;
  const inputClasses = `dyvix-input ${currentType?.class} ${className}`.trim();
  const props = {
    className: inputClasses,
    type: currentType?.type,
    ...(placeholder && {placeholder: placeholder}),
    style: {
      ...(background && { background: background }),
      ...(color && { color: color }),
      ...style
    }
  };

  function handleBlur(e) {
    if (typeof onBlur === 'function') {
      onBlur(e);
    }
  }
  function handleFocus(e) {
    if (typeof onFocus === 'function') {
      onFocus(e);
    }
  }
  function handleChange(e) {
    if (typeof onChange === 'function') {
      onChange(e);
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
    <div className="dyvix-input-wrapper" ref={inputRef} {...rest}>
      <input
        {...props}
        onFocus={(e) => handleFocus(e)}
        onBlur={(e) => handleBlur(e)}
        onChange={(e) => handleChange(e)}
      ></input>
    </div>
  );
}

export default DyvixInput;
