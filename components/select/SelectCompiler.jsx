import './dependencies/style/styles.css';
import React from 'react';
import SelectEngine from './SelectEngine';
import animationsData from '../animations.json';
import { useGSAP } from '@gsap/react';

const supportedTypes = ['select', 'autocomplete'];

function DynamicSelect({
  elements = [],
  onChangeCallback,
  type = 'select',
  animation = 'fade',
  ...props
}) {
  const [Select, SetSelect] = React.useState({
    is_rendered: true,
    is_open: false,
    elements: [],
    selected: ''
  });
  const selectRef = React.useRef(null);
  const dropdownSelectRef = React.useRef(null);
  const is_valid = ValidateInput(type);

  if (is_valid.status === -1) {
    return null;
  }

  function onChangeInternalCallback(data) {
    onChangeCallback(data);
  }

  function TranslateEngineType(value, handler, controller) {
    if (type === 'select') {
      if (handler !== 'focus' && handler !== 'blur') return;

      controller((prevData) => ({
        ...prevData,
        is_open: handler === 'focus',
        elements: elements
      }));
    }
  }

  const PopulateSelect = (value, controller, elementArray) => {
    value = value.toLowerCase();

    if (!value) {
      controller((prevData) => ({
        ...prevData,
        is_open: false
      }));
      return;
    }

    const result = elementArray.filter((element) => {
      const items = element.trim().toLowerCase();
      const query = value.trim().toLowerCase();

      return items.startsWith(query);
    });

    if (result.length == 0) {
      controller((prevData) => ({
        ...prevData,
        elements: [],
        is_open: false
      }));

      return;
    }

    controller((prevData) => ({
      ...prevData,
      elements: result,
      is_open: true
    }));
  };
  const currentAnimation = animationsData.find(
    (e) => e.animation.trim().toLowerCase() === animation.trim().toLowerCase()
  );

  useGSAP(() => {
    if (!selectRef.current || !currentAnimation) return;

    gsap.fromTo(selectRef.current, currentAnimation.from, {
      ...currentAnimation.to,
      duration: currentAnimation['default-duration'],
      ease: currentAnimation.ease
    });
  }, [currentAnimation]);

  return (
    <div className="dyvix-select-warper" style={props}>
      <input
        className="dyvi-select"
        type="text"
        ref={selectRef}
        onChange={(e) => {
          PopulateSelect(e.target.value, SetSelect, elements);
          onChangeInternalCallback(e.target.value);
        }}
        onFocus={(e) => {
          TranslateEngineType(e.target.value, 'focus', SetSelect);
        }}
        onBlur={(e) => {
          TranslateEngineType(e.target.value, 'blur', SetSelect);
        }}
        type={type}
      />
      <SelectEngine
        elements={Select.elements}
        is_open={Select.is_open}
        is_rendered={Select.is_rendered}
        inputRef={selectRef}
        ref={dropdownSelectRef}
        controller={SetSelect}
        OnChangeCallback={onChangeCallback}
      />
    </div>
  );
}

function ValidateInput(type) {
  if (!supportedTypes.includes(type)) {
    return { status: -1, error: 'Elements should include a valid type.' };
  }

  return { status: 1 };
}

export default DynamicSelect;
