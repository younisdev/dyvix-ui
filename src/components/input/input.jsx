import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './dependencies/style/style.css';
import React from 'react';
import { Validateinput } from './validation';

/**
 * @param {Object} props
 * @param {string} [props.type] - Input type, defaults to 'text'
 * @param {string} [props.placeholder] - Input placeholder text
 * @param {string} [props.autoComplete] - Input autoComplete attribute
 * @param {string} [props.background] - Input background color
 * @param {string} [props.color] - Input color
 * @param {string} [props.animation] - Animation name, defaults to fade
 * @param {string} [props.className] - Input className
 * @param {string} [props.name] - Input name
 * @param {string} [props.id] - Input id
 * @param {boolean} [props.disabled] - Disables the input when true
 * @param {string} [props['aria-label']] - Accessible label for the input
 * @param {Function} [props.onFocus] - Focus event callback
 * @param {Function} [props.onBlur] - Blur event callback
 * @param {Function} [props.onChange] - Change event callback, receives the event object
 * @param {Object} [props.style] - Inline style overrides
 */
function DyvixInput({
  type = 'text',
  placeholder,
  autoComplete,
  background,
  color,
  animation = 'fade',
  className = '',
  name,
  id,
  disabled,
  'aria-label': ariaLabel,
  onFocus,
  onBlur,
  onChange,
  style,
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
  }, [type, animation]);

  const currentAnimation = animation ? configs['animation'] : null;
  const currentType = type ? configs['type'] : null;
  const inputClasses =
    `dyvix-input ${currentType?.class ?? ''} ${className}`.trim();
  const props = {
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
