import elementsData from './dependencies/elements.json';
import DyvixSelect from '../select/SelectCompiler';
import validationData from './dependencies/validator/validators.json';
import typesData from './dependencies/types.json';
import './dependencies/style/style.css';
import * as validatorsFunctions from './dependencies/validator/validators';
import {
  ExecuteValidator,
  ExecuteRegex
} from './dependencies/validator/validators';
import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SerializeData, ValidateModal } from './validation';
import Version from '../../../package.json';
import DyvixButton from '../button/button';
import DyvixFile from '../file/file';
import DyvixInput from '../input/input';
import DyvixLabel from '../label/label';
import type {
  DyvixModalProps,
  NormalizedDyvixModalElements,
  NormalizedDyvixModalStep
} from './dependencies/modal.types';
import type { DyvixButtonThemes } from '../button/dependencies/button.types';
import { ConstructClasses, SmartPropsSplitting } from '../../utils/utils';
import type { DyvixLabelThemes } from '../label/dependencies/label.types';
import { EvaluateFailure, GuardStatus } from '../../utils/DyvixGuard.js';

export const validType = typesData.map((e) => e.type);
export const validRules = validationData.map((e) => e.preset);

export const eleData = elementsData;
const componentsMap: Record<string, React.ElementType> = {
  DyvixSelect: DyvixSelect,
  DyvixFile: DyvixFile,
  DyvixInput: DyvixInput
};

const DyvixModal: React.FC<DyvixModalProps> = ({
  title,
  type = 'form',
  elements,
  steps,
  preset,
  overrides,
  theme,
  background,
  animation,
  Id,
  dynamicPositioning = true,
  className,
  onSubmit,
  onChange,
  onClose,
  style,
  timeline
}) => {
  const [data, SetData] = React.useState<Record<string, any>>({});
  const [errors, SetErrors] = React.useState<Record<string, string | null>>({});
  const [visibility, SetVisibility] = React.useState<boolean>(true);
  const [status, SetStatus] = React.useState<string>('entering');
  const [configs, SetConfig] = React.useState({});

  const [{ modalSteps, currentStep }, setModalSteps] = React.useState<{
    modalSteps: NormalizedDyvixModalStep[];
    currentStep: number;
  }>({ modalSteps: [], currentStep: 0 });

  // utilized only when steps prop is being used
  const nextStep = () => {
    if (!modalSteps || modalSteps.length === 0) return;

    setModalSteps((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, prev.modalSteps.length - 1)
    }));
  };
  const prevStep = () => {
    if (!modalSteps || modalSteps.length === 0) return;

    setModalSteps((prev) => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1)
    }));
  };

  const fields = modalSteps[currentStep]?.elements ?? [];
  const stepsKey = JSON.stringify(steps ?? null);
  const elementsKey = JSON.stringify(elements ?? null);
  const latestConfig = React.useRef({ steps, elements });
  latestConfig.current = { steps, elements };

  React.useEffect(() => {
    async function GetFields() {
      const { steps, elements } = latestConfig.current;
      const validator = await ValidateModal(
        title,
        type,
        elements,
        steps,
        preset,
        theme,
        animation,
        onSubmit,
        SetConfig,
        instanceId
      );

      if (validator.status === GuardStatus.Error) {
        return EvaluateFailure(validator.error, validator.status);
      }
      const data = await SerializeData(title, elements, preset, steps);

      if (!data) {
        return;
      }

      setModalSteps((prev) => ({
        ...prev,
        modalSteps: data,
        currentStep: 0
      }));
    }

    GetFields();
    return () => {
      const key = `DYVIX_${Version['version']}_Modal_theme_${instanceId}`;
      const ele = document.getElementById(key);
      if (ele) ele.remove();
    };
  }, [theme, stepsKey, elementsKey, preset, animation, title]);

  const instanceId = React.useId();
  const modalRef = React.useRef<HTMLFormElement | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const addedToTimeLineRef = React.useRef<{
    theme: string | null;
    animation: string | null;
  } | null>(null);
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
  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const newErrors = handleValidation(data);
    const allow = Object.values(newErrors).every((val) => val === null);
    if (
      typeof onSubmit === 'function' &&
      allow &&
      currentStep === modalSteps.length - 1
    ) {
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
    `dyvix-modal`,
    !currentTheme?.class ? 'dyvix-modal-default' : '',
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
  const BASEHEIGHT = 210; // Ceiling space + Floor space combined
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

  const { wrapperProps, elementProps } = SmartPropsSplitting({
    style: {
      ...(dynamicPositioning && {
        position: 'fixed',
        inset: 0,
        width: 'auto',
        height: 'auto',
        overflowY: 'auto',
        padding: '20px',
        overflowBehavior: 'contain'
      }),
      ...style
    }
  });

  const { style: splitElementStyles } = elementProps;
  const combinedWrapperStyle = {
    ...(!animation && { opacity: 1 }),
    ...wrapperProps.style,
    ...{
      ...(background && { '--dyvix-modal-bg': background })
    },
    ...overrides
  };
  const modalStyles = {
    margin: 'auto',
    height: dynamicHeight,
    width: dynamicWidth,
    maxHeight: 'calc(100dvh - 6rem)',
    maxWidth: 'min(100%, 95vh)',
    transition: 'all 0.3s ease-out',
    ...(fields?.length > 7 &&
      currentTheme?.radiused && { borderRadius: '47%' }),
    ...splitElementStyles
  };

  title = modalSteps[currentStep]?.title || title;

  if (currentPreset) {
    title = currentPreset['default-title'] || title;
  }
  React.useEffect(() => {
    modalSteps.forEach((fields) =>
      fields.elements?.forEach((field) => {
        field.name.forEach((name) => {
          SetData((prev: Record<string, string | number>) => ({
            ...prev,
            [name]: ''
          }));
        });
      })
    );
  }, [modalSteps]);
  // Auto-focus for the first input when modal opens
  React.useEffect(() => {
    if (visibility && wrapperRef.current) {
      // Search the first input, select or textarea inside the modal
      const firstInput = wrapperRef.current.querySelector<HTMLElement>(
        'input, select, textarea'
      );

      // If input exist make focus
      if (firstInput) {
        firstInput.focus();
      }
    }
  }, [visibility]); // It only runs when the modal opens/closes

  useGSAP(
    () => {
      if (!wrapperRef.current) return;

      if (!currentAnimation) {
        if (status === 'leaving') {
          SetVisibility(false);
        }

        return;
      }
      const toVars: GSAPTweenVars = {
        ...currentAnimation.to,
        duration: currentAnimation['default-duration'],
        ease: currentAnimation.ease
      };

      if (timeline) {
        const activeTheme = theme ?? currentTheme ?? null;
        const activeAnim = animation ?? null;
        const isCompleted =
          addedToTimeLineRef.current?.theme === activeTheme &&
          addedToTimeLineRef.current?.animation === activeAnim;

        if (status === 'entering') {
          if (!isCompleted) {
            addedToTimeLineRef.current = {
              theme: activeTheme || null,
              animation: activeAnim || null
            };

            const childTween = gsap
              .timeline()
              .set(wrapperRef.current, {
                autoAlpha: 0,
                ...currentAnimation.from
              })
              .to(wrapperRef.current, {
                autoAlpha: 1,
                ...toVars
              });

            timeline.add(childTween, '+=0');
          }
        } else if (status === 'leaving') {
          const leavingTween = gsap.timeline().to(wrapperRef.current, {
            ...currentAnimation.from,
            duration: currentAnimation['default-duration'],
            ease: currentAnimation.ease,
            onComplete: () => SetVisibility(false)
          });
          timeline.add(leavingTween, '+=0');
          addedToTimeLineRef.current = null;
        }
        return;
      }

      if (status === 'entering') {
        gsap.set(wrapperRef.current, {
          autoAlpha: 0,
          ...currentAnimation.from
        });

        gsap.to(wrapperRef.current, {
          autoAlpha: 1,
          ...currentAnimation.to,
          duration: currentAnimation['default-duration'] ?? 0.3,
          ease: currentAnimation.ease ?? 'power2.out'
        });
      } else {
        gsap.to(wrapperRef.current, {
          ...currentAnimation.from,
          duration: currentAnimation['default-duration'],
          ease: currentAnimation.ease,
          onComplete: () => SetVisibility(false)
        });
      }
    },
    {
      scope: wrapperRef,
      dependencies: [currentAnimation, status, currentTheme]
    }
  );

  useGSAP(() => {
    if (!modalRef.current || !dynamicHeight || !dynamicWidth) return;

    if (!animation) {
      gsap.set(modalRef.current, {
        height: dynamicHeight,
        width: dynamicWidth
      });
      return;
    }

    gsap.to(modalRef.current, {
      height: dynamicHeight,
      width: dynamicWidth,
      duration: 0.35,
      ease: 'power3.out',
      overwrite: 'auto'
    });
  }, [dynamicHeight, dynamicWidth, animation]);

  return (
    <>
      {visibility && (
        <div
          ref={wrapperRef}
          className={ConstructClasses(
            'dyvix-modal-wrapper',
            currentTheme?.radiused ? 'dyvix-modal-radiused' : ''
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`header_${instanceId}`}
          {...wrapperProps}
          style={combinedWrapperStyle}
        >
          <form
            className={serializedClassName}
            ref={modalRef}
            id={Id}
            style={modalStyles}
            onSubmit={handleSubmit}
          >
            {currentType?.closable && (
              <button
                className="modal-close-btn"
                type="button"
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
            <h3
              className="dyvix-modal-header"
              id={`header_${instanceId}`}
              style={themeTextStyle}
            >
              {title}
            </h3>

            {modalSteps.length > 1 && (
              <div className="dyvix-modal-step-indicator">
                {modalSteps.map((step, idx) => (
                  <span
                    key={`step-${idx}`}
                    className={`step-dot${currentStep === idx ? ' active' : ''}${currentStep > idx ? ' completed' : ''}`}
                    aria-label={`step ${idx + 1}: ${step.title}`}
                  />
                ))}
              </div>
            )}
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
                        `dyvix-modal-element ` + elementDef?.['default-class'],
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
                        className: 'dyvix-modal-element'
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
            <div className="dyvix-modal-button-holder">
              {modalSteps.length > 1 && currentStep !== 0 && (
                <DyvixButton
                  type="button"
                  className="dyvix-modal-button"
                  onClick={prevStep}
                  theme={(theme?.toLowerCase() as DyvixButtonThemes) || null}
                  animation={null}
                >
                  Back
                </DyvixButton>
              )}
              {currentType?.submit && (
                <DyvixButton
                  type={
                    modalSteps.length > 1 &&
                    currentStep !== modalSteps.length - 1
                      ? 'button'
                      : 'submit'
                  }
                  className="dyvix-modal-button"
                  onClick={() => {
                    const isIntermediateStep =
                      modalSteps.length > 1 &&
                      currentStep !== modalSteps.length - 1;
                    if (isIntermediateStep) {
                      const currentErrors = handleValidation(data);
                      const hasErrors = Object.values(currentErrors).some(
                        (val) => val !== null && val !== undefined && val !== ''
                      );
                      if (!hasErrors) {
                        nextStep();
                      }
                    }
                  }}
                  theme={(theme?.toLowerCase() as DyvixButtonThemes) || null}
                  animation={null}
                >
                  {modalSteps.length > 1 &&
                  currentStep !== modalSteps.length - 1
                    ? 'Next'
                    : currentType.submitLabel}
                </DyvixButton>
              )}
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default DyvixModal;
