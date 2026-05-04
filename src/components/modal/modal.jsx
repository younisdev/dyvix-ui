import elementsData from './dependencies/elements.json';
import DynamicSelect from '../select/SelectCompiler';
import validationData from './dependencies/validator/validators.json';
import typesData from './dependencies/types.json';
import './dependencies/style/elements.css';
import * as validatorsFunctions from './dependencies/validator/validators';
import {
  ExecuteValidator,
  ExecuteRegex
} from './dependencies/validator/validators';
import {
  SJCManager,
  CACHETYPE
} from '../../utils/Smart Json Caching/SJCManager';
import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  SerializeData,
  normalizeElements,
  validateElements
} from './InputValidation';
import { GaurdStatus } from '../../utils/DyvixGuard';
import Version from '../../../package.json';
import DyvixButton from '../button/button';

export const validType = typesData.map((e) => e.type);
export const validRules = validationData.map((e) => e.preset);

export const eleData = elementsData;
const componentsMap = { DynamicSelect: DynamicSelect };

/**
 * @param {Object} props
 * @param {string} props.title - Modal title
 * @param {('auth'|'form')} props.type - Modal type
 * @param {('Singularity'|'Industrial'|'Ember'|'Frost'|'Blade'|'Neon'|'Aurora')} props.theme - Modal theme
 * @param {string} [props.animation] - Animation name, defaults to theme default
 * @param {string} [props.Id] - modal id
 * @param {string} [props.className] - modal className
 * @param {Function} [props.onClose] - Close callback
 * @param {Function} [props.onChange] - Change callback
 * @param {Function} [props.onSubmit] - Submit callback
 * @param {Array<Object>} props.elements - Array of element configs
 */
function Modal({
  title = '!/',
  type = `form`,
  elements,
  preset = '!/',
  theme = 'Singularity',
  animation = '!/',
  Id,
  className,
  onSubmit,
  onChange,
  onClose
}) {
  const [data, SetData] = React.useState({});
  const [errors, SetErrors] = React.useState({});
  const [visibility, SetVisibility] = React.useState(true);
  const [status, SetStatus] = React.useState('entering');
  const [configs, SetConfig] = React.useState({});
  const [fields, SetFields] = React.useState(null);
  const instanceId = React.useId();
  const modalRef = React.useRef(null);
  function handleInputChange(name, value) {
    const validation = handleValidation();
    const nextData = { ...data, [name]: value };
    SetData(nextData);
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
  function handleValidation() {
    const newErrors = {};
    for (const field of fields) {
      if (!field.validation) continue;
      for (const [index, currentName] of field.name.entries()) {
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
          newErrors[currentName] = result.status ? null : result.error;
        }
      }
    }
    SetErrors(newErrors);
  }
  function handleSubmit() {
    const validation = handleValidation();

    if (typeof onSubmit === 'function') {
      onSubmit(data);
    }
  }

  const currentType = typesData.find(
    (e) => e.type.trim().toLowerCase() === type.trim().toLowerCase()
  );
  const currentTheme = configs['theme'];
  const currentAnimation = configs['animation'];
  const currentPreset = configs['preset'];
  const serilaizedclassName =
    className + ` ${currentTheme?.class}` + ` ${currentType.class}`;
  // Dynamicily calculate modal sizing and position
  const heightMap = {
    1: '23rem',
    2: '25rem',
    3: '26rem',
    4: '30rem',
    5: '34rem',
    6: '40rem',
    7: '43rem',
    8: '48rem',
    9: '53rem'
  };
  let idealSize = heightMap[fields?.length] || '26rem';
  const geometryBuffer = currentTheme?.radiused
    ? (2.5 * fields?.length) / 3
    : 0;
  idealSize = `calc(${idealSize} + ${geometryBuffer}rem)`;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const dynamicHeight = isMobile ? `min(${idealSize}, 95vh)` : idealSize;
  const dynamicWidth = `min(${idealSize}, 95vw, 95vh)`;
  const isCentered = fields?.length <= 5;
  const dynamicMargin = isCentered ? '12vh auto' : '1.5rem auto';
  const modalStyles = {
    height: dynamicHeight,
    width: dynamicWidth,
    margin: dynamicMargin,
    transition: 'all 0.3s ease-out'
  };
  if (currentPreset) {
    title = title !== '!/' ? title : currentPreset['default-title'];
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

      SetFields(data);
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
        SetData((prev) => ({ ...prev, [name]: null }));
      });
    });
  }, [fields]);

  // Auto-focus for the first input when modal opens
  React.useEffect(() => {
    if (visibility && modalRef.current) {
      // Search the first input, select o textarea inside the modal
      const firstInput = modalRef.current.querySelector(
        'input, select, textarea'
      );

      // If input exist make focus
      if (firstInput) {
        firstInput.focus();
      }
    }
  }, [visibility]); // It only runs when the modal opens/closes

  useGSAP(() => {
    if (!modalRef.current || !currentAnimation) return;
    gsap.set(modalRef.current, { margin: dynamicMargin });

    if (status === 'entering') {
      gsap.fromTo(modalRef.current, currentAnimation.from, {
        ...currentAnimation.to,
        duration: currentAnimation['default-duration'],
        ease: currentAnimation.ease
      });
    } else {
      gsap.fromTo(modalRef.current, currentAnimation.to, {
        ...currentAnimation.from,
        duration: currentAnimation['default-duration'],
        ease: currentAnimation.ease,
        onComplete: () => SetVisibility(false)
      });
    }
  }, [currentAnimation, status]);

  return (
    <>
      {visibility && (
        <div ref={modalRef} className="dyvix-modal-wrapper" role="dialog" aria-modal="true" aria-labelledby="modal-header">
          <div
            className={`modal ${serilaizedclassName}`}
            id={Id}
            ref={modalRef}
            style={modalStyles}
          >
            {currentType.closable && (
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
            <h3 id="modal-header">{title}</h3>
            {fields?.map((field, i) => {
              const elementDef =
                elementsData.find((e) => e.element === field.type) ||
                elementsData.find((e) =>
                  e['inherited-element']?.includes(field.type)
                );
              const Tag = elementDef.is_custom
                ? componentsMap[elementDef.tag]
                : elementDef.tag;

              return (
                <div className="grouped-elements" key={field.name || i}>
                  {Array.from({ length: field.amount }, (_, j) => {
                    const name = field.name[j];
                    const id = field.id[j];
                    const fontSize = field.amount === 3 ? '0.6rem' : 'normal';
                    const fontWeight = field.amount === 3 ? '520' : '200';
                    // Spread aria props safely to avoid runtime errors if elementDef.aria is missing or null
                    let ariaProps = elementDef.aria
                      ? { ...elementDef.aria }
                      : {};
                    // Allow field-specific aria overrides for inherited elements (e.g., search gets role="searchbox")
                    const overrideConfig =
                      elementDef['inherit-overrides']?.[field.type];

                    if (overrideConfig && overrideConfig.aria) {
                      ariaProps = { ...ariaProps, ...overrideConfig.aria };
                    }

                    // Build aria attributes object with defensive checks for undefined/null values
                    const ariaAttributes = {};

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
                    const options =
                      Tag === 'select' || elementDef.tag === 'DynamicSelect'
                        ? Array.isArray(field.options[0])
                          ? field.options[j]
                          : field.options
                        : [];
                    const fieldError = errors[name];
                    const ErrorId = `${id && id !== '!/' ? id: field.placeholder[j]}-error`.toLowerCase().replace(/[^a-z0-9-]/g, '-');;
                    const Tagprobs = {
                      className: `modal-element ` + elementDef['default-class'],
                      name: name,
                      style: {
                        fontSize: fontSize,
                        fontWeight: fontWeight
                      },
                      ...ariaAttributes,
                      ...(id && id !== '!/' && { id: id }),
                      ...(elementDef['supports-placeholder'] && {
                        placeholder: field.placeholder[j],
                        "aria-label": field.placeholder[j]
                      }),
                      ...(elementDef['supports_type'] && { type: field.type }),
                      ...(elementDef['supports_autocomplete'] && {
                        autoComplete:
                          field.type === 'password' ? 'current-password' : 'on'
                      }),
                      ...(elementDef.tag === 'DynamicSelect' && {
                        elements: options,
                        animation: '!/',
                        className: 'modal-element'
                      }),
                      ...(ErrorId && {
                        'aria-describedby': ErrorId 
                      })
                    };

                    return (
                      <div className="dyvix-field-wrapper" key={name}>
                        {elementDef['requires-options'] && Tag === 'select' ? (
                          <Tag
                            defaultValue=""
                            key={j}
                            {...Tagprobs}
                            onChange={(e) =>
                              handleInputChange(name, e.target.value)
                            }
                          >
                            <option disabled value="">
                              {field.placeholder[j]}
                            </option>
                            {options.map((opt, index) => (
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
                        ) : field.type === 'checkbox' ? (
                          <label key={j} className="modal-checkbox-label">
                            <Tag
                              {...Tagprobs}
                              onChange={(e) =>
                                handleInputChange(
                                  name,
                                  elementDef['is_custom'] ? e : e.target.checked
                                )
                              }
                            />
                            {field.placeholder?.[j]}
                          </label>
                        ) : (
                          <Tag
                            key={j}
                            {...Tagprobs}
                            onChange={(e) =>
                              handleInputChange(
                                name,
                                elementDef['is_custom'] ? e : e.target.value
                              )
                            }
                          />
                        )}
                        <span className="dyvix-error-text" id={ErrorId}>{fieldError}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
            {currentType.submit && (
              <DyvixButton
                className="modal-btn"
                onClick={() => handleSubmit()}
                theme={theme.toLowerCase()}
              >
                {currentType.submitLabel}
              </DyvixButton>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;