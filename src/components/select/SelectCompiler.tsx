import './dependencies/style/styles.css';
import React, { type Dispatch, type SetStateAction } from 'react';
import SelectEngine from './SelectEngine';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { EvaluateFailure, GuardStatus } from '../../utils/DyvixGuard';
import { ValidateSelect } from './validation';
import Version from '../../../package.json';
import type {
  DyvixSelectProps,
  DyvixSelectState
} from './dependencies/select.types';
import { ConstructClasses } from '../../utils/utils';

const DyvixSelect: React.FC<DyvixSelectProps> = ({
  elements = [],
  onChange,
  type = 'select',
  animation = 'fade',
  theme,
  background,
  dropdownBackground,
  className,
  placeholder = '',
  style,
  ...rest
}) => {
  const parsedType = type.includes('-') ? type.split('-')[1] : type;

  const [Select, SetSelect] = React.useState<DyvixSelectState>({
    is_rendered: true,
    is_open: false,
    elements: [],
    selected: '',
    activeIndex: -1
  });
  const selectWrapperRef = React.useRef<HTMLDivElement>(null);
  const selectRef = React.useRef<HTMLInputElement>(null);
  const [configs, SetConfig] = React.useState<Record<string, any>>({});
  const instanceId = React.useId();
  const dropdownSelectRef = React.useRef<HTMLDivElement>(null);

  function onChangeInternalCallback(data: string | number) {
    if (typeof onChange !== 'function') return;

    onChange(data);
  }

  function TranslateEngineType(
    handler: 'focus' | 'blur',
    controller: Dispatch<SetStateAction<DyvixSelectState>>
  ) {
    if (parsedType === 'select') {
      if (handler !== 'focus' && handler !== 'blur') return;

      controller((prevData) => ({
        ...prevData,
        is_open: handler === 'focus',
        elements: elements
      }));
    }
  }

  const PopulateSelect = (
    value: string | number,
    controller: Dispatch<SetStateAction<DyvixSelectState>>,
    elementArray: (string | number)[]
  ) => {
    value = String(value).toLowerCase();

    if (!value) {
      controller((prevData) => ({
        ...prevData,
        is_open: false
      }));
      return;
    }

    const result = elementArray.filter((element) => {
      const items = String(element).trim().toLowerCase();
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
  const currentTheme = (configs as any)['theme'];
  const currentAnimation = animation ? (configs as any)['animation'] : null;
  const dropdownThemeClass = currentTheme?.['dropdown-class'];
  const inputThemeClass = currentTheme?.['input-class'];

  React.useEffect(() => {
    async function validate() {
      const validator = await ValidateSelect(
        elements,
        parsedType,
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
      const key = `DYVIX_${Version['version']}_Select_theme_${instanceId}`;
      const ele = document.getElementById(key);
      if (ele) ele.remove();
    };
  }, [animation, theme, elements, parsedType]);

  function HandleKey(
    e: React.KeyboardEvent<HTMLInputElement>,
    controller: Dispatch<SetStateAction<DyvixSelectState>>
  ) {
    if (Select.is_open == false) return;

    const { key } = e;
    const max = Select.elements.length - 1;
    const min = -1;
    const index = Select.activeIndex;

    if (key === 'ArrowUp') {
      if (index <= min) return;
      controller((prevData) => ({
        ...prevData,
        activeIndex: index - 1
      }));
      e.preventDefault();
    }

    if (key === 'ArrowDown') {
      if (index >= max) return;
      controller((prevData) => ({
        ...prevData,
        activeIndex: index + 1
      }));
      e.preventDefault();
    }

    if (key === 'Enter') {
      if (index < 0 || index > max || !selectRef.current) return;
      const selectedVal = Select.elements[index] || '';

      selectRef.current.value = String(selectedVal);
      controller((prevData) => ({
        ...prevData,
        selected: selectedVal,
        is_open: false,
        activeIndex: -1
      }));
      e.preventDefault();
      onChangeInternalCallback(selectedVal);
    }

    if (key === 'Escape') {
      controller((prevData) => ({
        ...prevData,
        is_open: false,
        activeIndex: -1
      }));
    }
  }

  useGSAP(() => {
    if (!selectWrapperRef.current || !currentAnimation) return;

    gsap.fromTo(selectWrapperRef.current, currentAnimation.from, {
      ...currentAnimation.to,
      duration: currentAnimation['default-duration'],
      ease: currentAnimation.ease
    });
  }, [currentAnimation]);
  const props = {
    className: ConstructClasses(
      'dyvix-select-wrapper',
      currentTheme?.class,
      className
    ),
    style: {
      ...style
    }
  };

  const activeOptionId =
    `dyvix-select-active-${Select.activeIndex}-${instanceId}` || undefined;
  const inputProps: React.ComponentPropsWithRef<'input'> = {
    autoComplete: 'off',
    role: 'combobox',
    'aria-autocomplete': 'list' as const,
    'aria-expanded': Select.is_open,
    'aria-haspopup': 'listbox' as const,
    'aria-activedescendant': activeOptionId,
    className: ConstructClasses('dyvix-select-input', inputThemeClass),
    type: 'text',
    ...(background && { style: { background: background } }),
    ...rest,
    ref: selectRef,
    placeholder: placeholder || undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      PopulateSelect(e.target.value, SetSelect, elements);
      onChangeInternalCallback(e.target.value);
    },
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      TranslateEngineType('focus', SetSelect);
      if (rest.onFocus) rest.onFocus(e);
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      TranslateEngineType('blur', SetSelect);
      if (rest.onBlur) rest.onBlur(e);
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      HandleKey(e, SetSelect);
      if (rest.onKeyDown) rest.onKeyDown(e);
    }
  };

  const engineProps = {
    elements: Select.elements,
    is_open: Select.is_open,
    is_rendered: Select.is_rendered,
    inputRef: selectRef,
    activeIndex: Select.activeIndex,
    ref: dropdownSelectRef,
    ...(dropdownBackground && { background: dropdownBackground }),
    ...(dropdownThemeClass && { className: dropdownThemeClass }),
    controller: SetSelect,
    OnChangeCallback: (value: string | number) =>
      onChangeInternalCallback(value),
    placeholder: placeholder || undefined,
    activeOptionId: activeOptionId
  };

  return (
    <div {...props} ref={selectWrapperRef}>
      <div className="dyvix-select">
        <input {...inputProps} />
      </div>
      <SelectEngine {...engineProps} />
    </div>
  );
};

export default DyvixSelect;
