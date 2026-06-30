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
import { GuardStatus } from '../../utils/DyvixGuard';
import Version from '../../../package.json';
import DyvixButton from '../button/button';
import DyvixFile from '../file/file';
import DyvixInput from '../input/input';
import { values } from 'idb-keyval';

export const validType = typesData.map((e) => e.type);
export const validRules = validationData.map((e) => e.preset);

export const eleData = elementsData;
const componentsMap = {
  DynamicSelect: DynamicSelect,
  DyvixFile: DyvixFile,
  DyvixInput: DyvixInput
};

/**
 * @param {Object} props
 * @param {string} [props.title] - Modal title
 * @param {('auth'|'form')} [props.type] - Modal type
 * @param {('Singularity'|'Industrial'|'Ember'|'Frost'|'Blade'|'Neon'|'Aurora'|'Sunset'|'Crimson'|'Midnight')} [props.theme] - Modal theme
 * @param {string} [props.preset] - Modal preset name
 * @param {string} [props.background] - Modal background color
 * @param {string} [props.animation] - Animation name, defaults to theme default
 * @param {string} [props.Id] - Modal id
 * @param {string} [props.className] - Modal className
 * @param {Function} [props.onClose] - Close callback
 * @param {Function} [props.onChange] - Change callback
 * @param {Function} [props.onSubmit] - Submit callback
 * @param {Array<Object>} [props.elements] - Array of element configs
 * @param {Array<{title?: string, elements: Array<Object>}>} [props.steps] - Multi-step configuration. When provided, the modal is split into sequential pages with `Next`/`Back` navigation. Each step renders its own `elements`; `elements` is ignored when `steps` is set.
 * @param {Object} [props.style] - Inline style overrides
 */
function Modal({
  title = '!/',
  type = `form`,
  elements,
  steps,
  preset = '!/',
  theme = '!/',
  background,
  animation = '!/',
  Id,
  className,
  onSubmit,
  onChange,
  onClose,
  style
}) {
  const [data, SetData] = React.useState({});
  const [errors, SetErrors] = React.useState({});
  const [visibility, SetVisibility] = React.useState(true);
  const [status, SetStatus] = React.useState('entering');
  const [configs, SetConfig] = React.useState({});
  const [fields, SetFields] = React.useState([]);
  const [stepsFields, SetStepsFields] = React.useState([]);
  const [currentStep, SetCurrentStep] = React.useState(0);
  const instanceId = React.useId();
  const modalRef = React.useRef(null);
  const stepsBodyRef = React.useRef(null);

  // When `steps` is provided the modal renders one page at a time. `currentFields`
  // is the field set that is currently visible (the active step, or the flat
  // `elements` list for a classic modal). Data and errors live in shared state, so
  // they persist as the user navigates between steps.
  const isStepped = Array.isArray(steps) && steps.length > 0;
  const allFields = isStepped ? stepsFields.flat() : fields;
  const currentFields = isStepped ? stepsFields[currentStep] || [] : fields;
  const isLastStep = isStepped && currentStep >= steps.length - 1;
  function handleInputChange(name, value) {
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
  function handleValidation(data, fieldList = currentFields) {
    const newErrors = {};
    for (const field of fieldList) {
      if (Array.isArray(field.match)) {
        for (const [i, matchTo] of field.match.entries()) {
          if (matchTo) {
            const matchToFields = fieldList.find((f) => f.id.includes(matchTo));
            if (matchToFields) {
              const matchToIndex = matchToFields.id.findIndex(
                (f) => f === matchTo
              );
              const matchToName = matchToFields.name[matchToIndex];
              const matchToPlaceholder =
                matchToFields.placeholder[matchToIndex];
              const sourceValue = data[field.name[i]];
              const targetValue = data[matchToName];
              const serializeLabel = (str) => {
                if (!str) return 'Field';
                return str
                  .replace(/^(Enter|Type|Provide|Input|Your|Confirm)\s+/gi, '')
                  .trim();
              };
              const sourceLabel = serializeLabel(field.placeholder[i]);
              const targetLabel = serializeLabel(matchToPlaceholder);
              if (sourceValue && targetValue && sourceValue !== targetValue) {
                newErrors[field.name[i]] =
                  `${sourceLabel} must match ${targetLabel}`;
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
    // On a stepped modal the final submit re-validates every step's fields, not
    // just the visible one, so a skipped or back-navigated step can't slip through.
    const newErrors = handleValidation(data, allFields);
    const allow = Object.values(newErrors).every((val) => val === null);
    if (typeof onSubmit === 'function' && allow) {
      onSubmit(data);
    }
  }

  // Animate the current step out, swap to the target step, then animate it in.
  // Falls back to an instant swap if GSAP has no node to target.
  function transitionStep(commit, direction) {
    const node = stepsBodyRef.current;
    if (!node) {
      commit();
      return;
    }
    const offset = direction === 'back' ? 24 : -24;
    gsap.to(node, {
      opacity: 0,
      x: offset,
      duration: 0.18,
      ease: 'power2.in',
      onComplete: () => {
        commit();
        gsap.fromTo(
          node,
          { opacity: 0, x: -offset },
          { opacity: 1, x: 0, duration: 0.25, ease: 'power2.out' }
        );
      }
    });
  }

  function handleStepNext() {
    // Validate only the active step before advancing; persisted data carries over.
    const newErrors = handleValidation(data, currentFields);
    const allow = Object.values(newErrors).every((val) => val === null);
    if (!allow) return;
    if (isLastStep) {
      handleSubmit();
    } else {
      transitionStep(() => SetCurrentStep((s) => s + 1), 'next');
    }
  }

  function handleStepBack() {
    if (currentStep > 0) {
      transitionStep(() => SetCurrentStep((s) => s - 1), 'back');
    }
  }

  const currentType = typesData.find(
    (e) => e.type.trim().toLowerCase() === type.trim().toLowerCase()
  );
  const currentTheme = configs['theme'];
  const currentAnimation = configs['animation'];
  const currentPreset = configs['preset'];
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

  const serilaizedclassName =
    className +
    `${currentTheme?.class ? ` ${currentTheme?.class}` : ''}` +
    ` ${currentType.class}`;
  // Dynamicily calculate modal sizing and position
  const heightMap = {
    1: '19rem',
    2: '24rem',
    3: '26rem',
    4: '31rem',
    5: '37rem',
    6: '41rem',
    7: '46rem',
    8: '53rem',
    9: '57rem'
  };
  let idealSize = heightMap[currentFields?.length] || '26rem';
  const geometryBuffer =
    currentTheme?.radiused || !currentTheme
      ? (2.5 * currentFields?.length) / 3
      : 0;
  idealSize = `calc(${idealSize} + ${geometryBuffer}rem)`;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const dynamicHeight = isMobile ? `min(${idealSize}, 95vh)` : idealSize;
  const dynamicWidth = `min(${idealSize}, 95vw, 95vh)`;
  const isCentered = currentFields?.length <= 4;
  const dynamicMargin = isCentered ? '12vh auto' : '1.5rem auto';

  const defaultStyle = {
    ...(!currentTheme && { background: background || 'white' }),
    fontFamily: 'Geist, sans-serif',
    borderRadius: '2rem'
  };
  const activeStyle = style || defaultStyle;
  const modalStyles = {
    height: dynamicHeight,
    width: dynamicWidth,
    margin: dynamicMargin,
    transition: 'all 0.3s ease-out',
    ...activeStyle
  };
  if (currentPreset) {
    title = title !== '!/' ? title : currentPreset['default-title'];
    animation =
      animation !== '!/'
        ? animation
        : currentPreset['default-animation'] || 'fade';
    theme =
      theme !== '!/' ? theme : currentPreset['default-theme'] || 'Singularity';
  } else {
    theme = theme !== '!/' ? theme : '!/';
  }

  React.useEffect(() => {
    async function GetFields() {
      if (isStepped) {
        // Serialize each step independently, reusing the same field pipeline.
        // Sequential (not parallel) because SerializeData writes shared module
        // state while resolving theme/animation/preset config.
        const serialized = [];
        for (const step of steps) {
          const stepData = await SerializeData(
            title,
            type,
            step.elements,
            preset,
            theme,
            animation,
            Id,
            className,
            onSubmit,
            SetConfig,
            instanceId
          );
          serialized.push(Array.isArray(stepData) ? stepData : []);
        }
        SetStepsFields(serialized);
        SetCurrentStep(0);
      } else {
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
    }

    GetFields();
    return () => {
      const key = `DYVIX_${Version['version']}_Modal_theme_${instanceId}`;
      const ele = document.getElementById(key);
      if (ele) ele.remove();
    };
  }, [theme, preset, elements, steps, animation, title]);

  React.useEffect(() => {
    // Initialise every field across all steps to null once, so persisted data is
    // not reset while navigating between steps (navigation only changes currentStep).
    allFields?.forEach((field) => {
      field.name.forEach((name) => {
        SetData((prev) => ({ ...prev, [name]: null }));
      });
    });
  }, [fields, stepsFields]);

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
  }, [visibility, currentStep]); // Runs when the modal opens/closes or the step changes

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
        <div
          ref={modalRef}
          className="dyvix-modal-wrapper"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-header"
        >
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
            <h3 id="modal-header" style={themeTextStyle}>
              {title}
            </h3>
            {isStepped && (
              <div className="modal-steps-progress" aria-hidden="true">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    className={`modal-step-dot${
                      i === currentStep ? ' active' : ''
                    }${i < currentStep ? ' done' : ''}`}
                  />
                ))}
              </div>
            )}
            {isStepped && steps[currentStep]?.title && (
              <h4
                className="modal-step-title"
                style={themeTextStyle}
                aria-live="polite"
              >
                {steps[currentStep].title}
              </h4>
            )}
            <div
              className={isStepped ? 'modal-steps-body' : 'modal-fields-body'}
              ref={isStepped ? stepsBodyRef : null}
            >
              {currentFields?.map((field, i) => {
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
                      const ErrorId =
                        `${id && id !== '!/' ? id : field.placeholder[j]}-error`
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, '-');
                      const Tagprobs = {
                        className:
                          `modal-element ` + elementDef['default-class'],
                        name: name,
                        theme: theme,
                        style: {
                          fontSize: fontSize,
                          fontWeight: fontWeight,
                          ...(elementDef['tag'] !== 'DyvixInput' && {
                            ...themeInputStyle
                          })
                        },
                        ...ariaAttributes,
                        ...(id && id !== '!/' && { id: id }),
                        ...(elementDef['is_custom'] && { animation: null }),
                        ...(elementDef['supports-placeholder'] && {
                          placeholder: field.placeholder[j],
                          'aria-label': field.placeholder[j]
                        }),
                        ...(elementDef['supports-label'] && {
                          label: field.placeholder[j]
                        }),
                        ...(elementDef['supports_type'] && {
                          type: field.type
                        }),
                        ...(elementDef['supports_autocomplete'] && {
                          autoComplete:
                            field.type === 'password'
                              ? 'current-password'
                              : 'on'
                        }),
                        ...(elementDef.tag === 'DynamicSelect' && {
                          elements: options,
                          animation: '!/',
                          className: 'modal-element'
                        }),
                        ...(ErrorId && {
                          'aria-describedby': ErrorId
                        }),
                        ...(elementDef.tag !== 'DyvixFile' && {
                          onChange: (e) => {
                            const value =
                              elementDef.tag === 'DyvixInput'
                                ? e.target.value
                                : elementDef['is_custom']
                                  ? e
                                  : field.type === 'checkbox'
                                    ? e.target.checked
                                    : e.target.value;
                            handleInputChange(name, value);
                          }
                        }),
                        ...(elementDef.tag === 'DyvixFile' && {
                          onUpload: (e) => {
                            handleInputChange(name, e);
                          },
                          ...((theme === '!/' || !theme) && {
                            background: 'transparent'
                          })
                        })
                      };

                      return (
                        <div className="dyvix-field-wrapper" key={name}>
                          {elementDef['requires-options'] &&
                          Tag === 'select' ? (
                            <Tag defaultValue="" key={j} {...Tagprobs}>
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
                            <label
                              key={j}
                              className="modal-checkbox-label"
                              style={themeTextStyle}
                            >
                              <Tag {...Tagprobs} />
                              {field.placeholder?.[j]}
                            </label>
                          ) : (
                            <Tag key={j} {...Tagprobs} />
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
            </div>
            {currentType.submit &&
              (isStepped ? (
                <div className="modal-steps-nav">
                  {currentStep > 0 && (
                    <DyvixButton
                      className="modal-btn modal-step-back"
                      onClick={handleStepBack}
                      theme={theme.toLowerCase()}
                      animation={null}
                    >
                      Back
                    </DyvixButton>
                  )}
                  <DyvixButton
                    className="modal-btn modal-step-next"
                    onClick={handleStepNext}
                    theme={theme.toLowerCase()}
                    animation={null}
                  >
                    {isLastStep ? currentType.submitLabel : 'Next'}
                  </DyvixButton>
                </div>
              ) : (
                <DyvixButton
                  className="modal-btn"
                  onClick={handleSubmit}
                  theme={theme.toLowerCase()}
                  animation={null}
                >
                  {currentType.submitLabel}
                </DyvixButton>
              ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;
