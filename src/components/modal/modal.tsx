import elementsData from './dependencies/elements.json';
import DyvixSelect from '../select/SelectCompiler';
import validationData from './dependencies/validator/validators.json';
import typesData from './dependencies/types.json';
import './dependencies/style/elements.css';
import * as validatorsFunctions from './dependencies/validator/validators';
import {
  ExecuteValidator,
  ExecuteRegex
} from './dependencies/validator/validators';
import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SerializeData } from './InputValidation';
import Version from '../../../package.json';
import DyvixButton from '../button/button';
import DyvixFile from '../file/file';
import DyvixInput from '../input/input';
import DyvixLabel from '../label/label';
import type {
  DyvixModalProps,
  NormalizedDyvixElements
} from './dependencies/modal.types';
import type { DyvixButtonThemes } from '../button/dependencies/button.types';
import { ConstructClasses, SmartPropsSplitting } from '../../utils/utils';
import type { DyvixLabelThemes } from '../label/dependencies/label.types';

export const validType = typesData.map((e) => e.type);
export const validRules = validationData.map((e) => e.preset);

export const eleData = elementsData;
const componentsMap: Record<string, React.ElementType> = {
  DyvixSelect: DyvixSelect,
  DyvixFile: DyvixFile,
  DyvixInput: DyvixInput
};

const Modal: React.FC<DyvixModalProps> = ({
  title,
  type = 'form',
  elements,
  preset,
  theme,
  background,
  animation,
  Id,
  dynamicPositioning = true,
  className,
  onSubmit,
  onChange,
  onClose,
  style
}) => {
  const [data, SetData] = React.useState<Record<string, any>>({});
  const [errors, SetErrors] = React.useState<Record<string, string | null>>({});
  const [visibility, SetVisibility] = React.useState<boolean>(true);
  const [status, SetStatus] = React.useState<string>('entering');
  const [configs, SetConfig] = React.useState({});

  const [fields, SetFields] = React.useState<NormalizedDyvixElements[]>([]);
  const instanceId = React.useId();
  const modalRef = React.useRef<HTMLDivElement>(null);
  function handleInputChange(name: string, value: any) {
    const nextData = { ...data, [name]: value };
    SetData(nextData);
    const validation = handleValidation(nextData);

    if (typeof onChange === 'function') {
      onChange(nextData);
    }
  }
  function handleModalClose() {
    SetStatus('leaving');
    if (typeof onClose === 'function') {
      onClose();
    }
  }
  function handleValidation(data: Record<string, string | number>) {
    const newErrors: Record<string, string | null> = {};
    for (const field of fields) {
      if (field && Array.isArray(field.match) && field.match !== undefined) {
        for (const [i, matchTo] of field.match.entries()) {
          if (matchTo) {
            const matchToFields = fields.find((f) => f.id?.includes(matchTo));
            if (matchToFields) {
              const matchToIndex = matchToFields.id?.findIndex(
                (f) => f === matchTo
              );

              if (matchToIndex !== undefined && matchToIndex !== -1) {
                const matchToName = matchToFields.name[matchToIndex];
                const matchToPlaceholder =
                  matchToFields.placeholder[matchToIndex];
                const fieldName = field.name[i];

                if (!fieldName || !matchToName) continue;
                const sourceValue = data[fieldName];
                const targetValue = data[matchToName];
                const serializeLabel = (str: string) => {
                  if (!str) return 'Field';
                  return str
                    .replace(
                      /^(Enter|Type|Provide|Input|Your|Confirm)\s+/gi,
                      ''
                    )
                    .trim();
                };
                const sourceLabel = serializeLabel(field.placeholder[i] || '');
                const targetLabel = serializeLabel(matchToPlaceholder || '');
                if (sourceValue && targetValue && sourceValue !== targetValue) {
                  newErrors[fieldName] =
                    `${sourceLabel} must match ${targetLabel}`;
                }
              }
            }
          }
        }
      }
      if (!field.validation) continue;
      for (const [index, currentName] of field.name.entries()) {
        if (newErrors[currentName]) continue;
        let currentValidation = field.validation[index];
        let result = null;
        if (!currentValidation) continue;

        if (currentValidation.startsWith('$R')) {
          const [pattern, customError] = currentValidation.slice(2).split('|');
          result = ExecuteRegex(data[currentName], pattern, customError);
        } else {
          const validators = validationData.find(
            (e) =>
              e.preset.trim().toLowerCase() ===
              currentValidation.trim().toLowerCase()
          );

          if (!validators) continue;

          result = ExecuteValidator(data[currentName], validators.validators);
        }
        if (result) {
          if (!newErrors[currentName]) {
            newErrors[currentName] = result.status ? null : result.error;
          }
        }
      }
    }
    SetErrors(newErrors);
    return newErrors;
  }
  function handleSubmit() {
    const newErrors = handleValidation(data);
    const allow = Object.values(newErrors).every((val) => val === null);
    if (typeof onSubmit === 'function' && allow) {
      onSubmit(data);
    }
  }

  const currentType = typesData.find(
    (e) => e.type.trim().toLowerCase() === type.trim().toLowerCase()
  );
  const currentTheme = (configs as any)['theme'];
  const currentAnimation = (configs as any)['animation'];
  const currentPreset = (configs as any)['preset'];
  const themeTextStyle = {
    color: currentTheme?.['text-color']
  };

  const themeInputStyle = {
    ...(currentTheme?.['input-background'] && {
      background: currentTheme['input-background']
    }),
    ...(currentTheme?.['input-color'] && {
      color: currentTheme['input-color']
    }),
    ...(currentTheme?.['input-border'] && {
      border: currentTheme['input-border']
    })
  };

  const serializedClassName = ConstructClasses(
    className,
    currentTheme?.class || '',
    currentType?.class || ''
  );
  // Dynamicily calculate modal sizing and position
  // text row height seem to be suitable for other elements
  // Add more mapping keys if other elements started spacing weird
  const ROW_HEIGHT: Record<string, number> = {
    text: 56,
    radio: 65
  };
  const ROW_GAP = 25;
  const BASEHEIGHT = 200; // Ceiling space + Floor space combined
  const safeField = fields || [];

  let TOTAL_HEIGHT =
    BASEHEIGHT +
    safeField.reduce((acc, field, index) => {
      const type = field?.type;
      const gap = index < safeField.length - 1 ? ROW_GAP : 0;
      const height = ROW_HEIGHT[type] ?? ROW_HEIGHT.text;

      return acc + height! + gap;
    }, 0);

  const geometryBuffer =
    currentTheme?.radiused || !currentTheme ? (2.5 * fields?.length) / 3 : 0;
  TOTAL_HEIGHT += geometryBuffer * 16;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const dynamicHeight = isMobile
    ? `min(${TOTAL_HEIGHT}px, 95vh)`
    : `${TOTAL_HEIGHT}px`;
  const dynamicWidth = `min(${TOTAL_HEIGHT}px, 95vw, 95vh)`;
  const isCentered = fields?.length <= 4;
  const dynamicMargin = isCentered ? '12vh auto' : '1.5rem auto';
  const { wrapperProps, elementProps } = SmartPropsSplitting({
    style: {
      ...(dynamicPositioning
        ? { margin: dynamicMargin, justifySelf: 'center' }
        : {}),
      ...style
    }
  });
  const defaultStyle = !currentTheme
    ? {
        ...(!currentTheme && { background: background || 'white' }),
        fontFamily: 'Geist, sans-serif',
        borderRadius: '2rem'
      }
    : {};

  const { style: splitElementStyles } = elementProps;

  const modalStyles = {
    ...defaultStyle,
    height: dynamicHeight,
    width: dynamicWidth,
    transition: 'all 0.3s ease-out',
    ...(fields?.length > 7 &&
      currentTheme?.radiused && { borderRadius: '47%' }),
    ...splitElementStyles
  };
  if (currentPreset) {
    title = title || currentPreset['default-title'];
    animation = animation || currentPreset['default-animation'] || 'fade';
    theme = theme || currentPreset['default-theme'] || 'Singularity';
  }

  React.useEffect(() => {
    async function GetFields() {
      const data = await SerializeData(
        title,
        type,
        elements,
        preset,
        theme,
        animation,
        Id,
        className,
        onSubmit,
        SetConfig,
        instanceId
      );

      SetFields(data || []);
    }

    GetFields();
    return () => {
      const key = `DYVIX_${Version['version']}_Modal_theme_${instanceId}`;
      const ele = document.getElementById(key);
      if (ele) ele.remove();
    };
  }, [theme, preset, elements, animation, title]);

  React.useEffect(() => {
    fields?.forEach((field) => {
      field.name.forEach((name) => {
        SetData((prev: Record<string, string | number>) => ({
          ...prev,
          [name]: ''
        }));
      });
    });
  }, [fields]);

  // Auto-focus for the first input when modal opens
  React.useEffect(() => {
    if (visibility && modalRef.current) {
      // Search the first input, select or textarea inside the modal
      const firstInput = modalRef.current.querySelector<HTMLElement>(
        'input, select, textarea'
      );

      // If input exist make focus
      if (firstInput) {
        firstInput.focus();
      }
    }
  }, [visibility]); // It only runs when the modal opens/closes

  useGSAP(() => {
    if (!modalRef.current) return;

    if (!currentAnimation) {
      if (status === 'leaving') {
        SetVisibility(false);
      }

      return;
    }

    if (status === 'entering') {
      gsap.set(modalRef.current, { autoAlpha: 0, ...currentAnimation.from });
      gsap.to(modalRef.current, {
        autoAlpha: 1,
        ...currentAnimation.to,
        duration: currentAnimation['default-duration'] ?? 0.3,
        ease: currentAnimation.ease ?? 'power2.out'
      });
    } else {
      gsap.to(modalRef.current, {
        ...currentAnimation.from,
        duration: currentAnimation['default-duration'],
        ease: currentAnimation.ease,
        onComplete: () => SetVisibility(false)
      });
    }
  }, [currentAnimation, status]);

  useGSAP(() => {
    if (!modalRef.current || !dynamicHeight || !dynamicWidth) return;

    gsap.to(modalRef.current, {
      height: dynamicHeight,
      width: dynamicWidth,
      duration: 0.35,
      ease: 'power3.out',
      overwrite: 'auto'
    });
  }, [dynamicHeight, dynamicWidth]);
  return (
    <>
      {visibility && (
        <div
          ref={modalRef}
          className="dyvix-modal-wrapper"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-header"
          {...wrapperProps}
        >
          <div
            className={`modal ${serializedClassName}`}
            id={Id}
            style={modalStyles}
          >
            {currentType?.closable && (
              <button
                className="modal-close-btn"
                onClick={() => handleModalClose()}
                aria-label="Close modal"
                style={{
                  top: currentTheme?.radiused ? '2rem' : '1rem',
                  right: currentTheme?.radiused ? '9rem' : '1rem'
                }}
              >
                ✕
              </button>
            )}
            <h3 id="modal-header" style={themeTextStyle}>
              {title}
            </h3>
            {fields?.map((field, i) => {
              const elementDef =
                elementsData.find((e) => e.element === field.type) ||
                elementsData.find((e) =>
                  e['inherited-element']?.includes(field.type)
                );
              const Tag: React.ElementType = elementDef?.is_custom
                ? (componentsMap[elementDef.tag] as React.ElementType)
                : (elementDef?.tag as React.ElementType);

              return (
                <div
                  className="grouped-elements"
                  key={
                    Array.isArray(field.name) && field.name.length > 0
                      ? field.name.join('-')
                      : i
                  }
                >
                  {Array.from({ length: field.amount }, (_, j) => {
                    const name = field.name[j] || '';
                    const id = field.id?.[j];
                    const fontSize = field.amount === 3 ? '0.6rem' : 'normal';
                    const fontWeight = field.amount === 3 ? '520' : '200';
                    // Spread aria props safely to avoid runtime errors if elementDef.aria is missing or null
                    let ariaProps: Record<string, any> = elementDef?.aria
                      ? { ...elementDef.aria }
                      : {};
                    // Allow field-specific aria overrides for inherited elements (e.g., search gets role="searchbox")
                    const inheritOverrides = elementDef?.[
                      'inherit-overrides'
                    ] as Record<string, any> | undefined;
                    const overrideConfig = inheritOverrides?.[field.type];

                    if (overrideConfig && overrideConfig.aria) {
                      ariaProps = { ...ariaProps, ...overrideConfig.aria };
                    }

                    // Build aria attributes object with defensive checks for undefined/null values
                    const ariaAttributes: Record<string, any> = {};

                    if (
                      ariaProps.role !== undefined &&
                      ariaProps.role !== null
                    ) {
                      ariaAttributes.role = ariaProps.role;
                    }
                    if (
                      ariaProps['aria-label'] !== undefined &&
                      ariaProps['aria-label'] !== null
                    ) {
                      ariaAttributes['aria-label'] = ariaProps['aria-label'];
                    }
                    if (
                      ariaProps['aria-required'] !== undefined &&
                      ariaProps['aria-required'] !== null
                    ) {
                      ariaAttributes['aria-required'] =
                        ariaProps['aria-required'];
                    }
                    const options = elementDef?.['requires-options']
                      ? field.options && Array.isArray(field.options[0])
                        ? field.options[j]
                        : field.options
                      : [];
                    const fieldError = errors[name];
                    const ErrorId =
                      `${id && id !== '!/' ? id : field.placeholder[j]}-error`
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, '-');
                    const tagProps = {
                      className:
                        `modal-element ` + elementDef?.['default-class'],
                      name: name,
                      theme: theme,
                      style: {
                        fontSize: fontSize,
                        fontWeight: fontWeight,
                        ...(elementDef?.['tag'] !== 'DyvixInput' && {
                          ...themeInputStyle
                        })
                      },
                      ...ariaAttributes,
                      ...(id && id !== '!/' && { id: id }),
                      ...(elementDef?.['is_custom'] && { animation: null }),
                      ...(elementDef?.['supports-placeholder'] && {
                        placeholder: field.placeholder[j],
                        'aria-label': field.placeholder[j]
                      }),
                      ...(elementDef?.['supports-label'] && {
                        label: field.placeholder[j]
                      }),
                      ...(elementDef?.['supports_type'] && {
                        type: field.type
                      }),
                      ...(elementDef?.['supports_autocomplete'] && {
                        autoComplete:
                          field.type === 'password' ? 'current-password' : 'on'
                      }),
                      ...(elementDef?.tag === 'DyvixSelect' && {
                        elements: options,
                        animation: '!/',
                        className: 'modal-element'
                      }),
                      ...(ErrorId && {
                        'aria-describedby': ErrorId
                      }),
                      ...(elementDef?.tag !== 'DyvixFile' && {
                        onChange: (e: any) => {
                          const value =
                            elementDef?.tag === 'DyvixInput'
                              ? e.target.value
                              : elementDef?.['is_custom']
                                ? e
                                : field.type === 'checkbox'
                                  ? e.target.checked
                                  : e.target.value;
                          handleInputChange(name || '', value);
                        }
                      }),
                      ...(elementDef?.tag === 'DyvixFile' && {
                        onUpload: (
                          e: React.ChangeEvent<HTMLInputElement> | File | string
                        ) => {
                          const value =
                            typeof e === 'object' && 'target' in e
                              ? e.target.value
                              : e;
                          handleInputChange(name || '', value);
                        },
                        ...(!theme && {
                          background: 'transparent'
                        })
                      })
                    };

                    return (
                      <div className="dyvix-field-wrapper" key={name}>
                        {elementDef!['requires-options'] && Tag === 'select' ? (
                          <Tag defaultValue="" key={j} {...tagProps}>
                            <option disabled value="">
                              {field.placeholder[j]}
                            </option>
                            {options?.map((opt, index) => (
                              <option
                                role="option"
                                key={index}
                                value={opt}
                                tabIndex={index}
                              >
                                {opt}
                              </option>
                            ))}
                          </Tag>
                        ) : field.type === 'radio' ? (
                          <div
                            key={j}
                            className="modal-radio-group"
                            role="radiogroup"
                            aria-label={field.placeholder?.[j]}
                            style={themeTextStyle}
                          >
                            {field.placeholder?.[j] &&
                              field.placeholder[j] !== '!/' && (
                                <DyvixLabel
                                  className="modal-radio-legend"
                                  animation={null}
                                  theme={theme as DyvixLabelThemes}
                                >
                                  {field.placeholder[j]}
                                </DyvixLabel>
                              )}
                            {options?.map((opt, index) => (
                              <DyvixLabel
                                key={index}
                                className="modal-radio-label"
                                animation={null}
                                theme={theme as DyvixLabelThemes}
                              >
                                <input
                                  type="radio"
                                  className="modal-radio"
                                  name={name}
                                  value={opt}
                                  checked={data[name] === opt}
                                  onChange={() =>
                                    handleInputChange(name, String(opt))
                                  }
                                  {...(id &&
                                    id !== '!/' && { id: `${id}-${index}` })}
                                />
                                {opt}
                              </DyvixLabel>
                            ))}
                          </div>
                        ) : field.type === 'checkbox' ? (
                          <label
                            key={j}
                            className="modal-checkbox-label"
                            style={themeTextStyle}
                          >
                            <Tag {...tagProps} />
                            {field.placeholder?.[j]}
                          </label>
                        ) : (
                          <Tag key={j} {...tagProps} />
                        )}
                        <span className="dyvix-error-text" id={ErrorId}>
                          {fieldError}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
            {currentType?.submit && (
              <DyvixButton
                className="modal-btn"
                onClick={handleSubmit}
                theme={(theme?.toLowerCase() as DyvixButtonThemes) || null}
                animation={null}
              >
                {currentType.submitLabel}
              </DyvixButton>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
