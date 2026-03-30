import elementsData from './dependencies/elements.json';
import themesData from './dependencies/themes.json';
import SelectEngine from '../select/SelectEngine';
import animationsData from '../animations.json';
import validationData from './dependencies/validator/validators.json';
import typesData from './dependencies/types.json';
import './dependencies/style/elements.css';
import './dependencies/style/themes.css';
import * as validatorsFunctions from './dependencies/validator/validators';
import ExecuteValidator from './dependencies/validator/validators';
import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SerializeData } from './InputValidation';

export const vaildThemes = themesData.map((e) => e.theme);
export const validType = typesData.map((e) => e.type);
export const validAnimations = animationsData.map((e) => e.animation);
const componentsMap = { SelectEngine: SelectEngine };

/**
 * @param {Object} props
 * @param {string} props.title - Modal title
 * @param {('auth'|'form')} props.type - Modal type
 * @param {('Singularity'|'Industrial'|'Ember'|'Frost'|'Blade'|'Neon'|'Aurora')} props.theme - Modal theme
 * @param {string} [props.animation] - Animation name, defaults to theme default
 * @param {string} [props.Id] - modal id
 * @param {string} [props.class] - modal class
 * @param {Function} [props.onClose] - Close callback
 * @param {Function} [props.onChange] - Change callback
 * @param {Function} [props.onSubmit] - Submit callback
 * @param {Array<Object>} props.elements - Array of element configs
 */
function Modal({
  title,
  type = `form`,
  elements,
  theme = 'Singularity',
  animation = '!/',
  Id,
  Class,
  onSubmit,
  onChange,
  onClose
}) {
  const [data, SetData] = React.useState({});
  const fields = SerializeData(
    title,
    type,
    elements,
    theme,
    animation,
    Id,
    Class,
    onSubmit
  );
  const modalRef = React.useRef(null);

  function handleInputChange(name, value) {
    const nextData = { ...data, [name]: value };
    SetData(nextData);
    onChange(nextData);
  }
  function handleValidation() {
    for (const field of fields) {
      if (!field.validation) continue;

      for (const [index, currentName] of field.name.entries()) {
        const currentValidation = field.validation[index];

        if (!currentValidation) continue;

        const validators = validationData.find(
          (e) =>
            e.preset.trim().toLowerCase() ===
            currentValidation.trim().toLowerCase()
        );

        if (!validators) continue;

        return ExecuteValidator(data[currentName], validators.validators);
      }
    }
  }
  function handleSubmit() {
    const validation = handleValidation();

    if (!validation.status) {
      console.log(validation.error);
      return;
    }

    onSubmit(data);
  }

  if (fields === null) {
    return null;
  }
  const currentType = typesData.find(
    (e) => e.type.trim().toLowerCase() === type.trim().toLowerCase()
  );
  const currentTheme = themesData.find(
    (e) => e.theme.trim().toLowerCase() === theme.trim().toLowerCase()
  );
  const animationQuery =
    animation === '!/' ? currentTheme['default-animation'] : animation;
  const currentAnimation = animationsData.find(
    (e) =>
      e.animation.trim().toLowerCase() === animationQuery.trim().toLowerCase()
  );
  const serilaizedClass =
    Class + ` ${currentTheme.class}` + ` ${currentType.class}`;
  const rowOffset = elements.length / 4;
  const dynamicHeight =
    rowOffset > 1 ? `${30 + (rowOffset - 1) * 15}rem` : '30rem';
  const dynamicWidth =
    currentTheme.radiused || rowOffset > 1
      ? `${30 + rowOffset * 10}rem`
      : '30rem';

  React.useEffect(() => {
    fields.forEach((field) => {
      field.name.forEach((name) => {
        SetData((prev) => ({ ...prev, [name]: null }));
      });
    });
  }, []);

  useGSAP(() => {
    if (!modalRef.current || !currentAnimation) return;

    gsap.fromTo(modalRef.current, currentAnimation.from, {
      ...currentAnimation.to,
      duration: currentAnimation['default-duration'],
      ease: currentAnimation.ease
    });
  }, [currentAnimation]);

  return (
    <div ref={modalRef} className="dyvix-modal-wrapper">
      <div
        className={serilaizedClass}
        id={Id}
        ref={modalRef}
        style={{
          height: dynamicHeight,
          width: dynamicWidth,
          position: 'relative'
        }}
      >
        {currentType.closable && (
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              top: currentTheme.radiused ? '2rem' : '1rem',
              right: currentTheme.radiused ? '9rem' : '1rem'
            }}
          >
            ✕
          </button>
        )}
        <h3 id="modal-header">{title}</h3>
        {fields.map((field, i) => {
          const elementDef =
            elementsData.find((e) => e.element === field.type) ||
            elementsData.find((e) =>
              e['inherited-element']?.includes(field.type)
            );
          const Tag = elementDef.is_custom
            ? componentsMap[elementDef.tag]
            : elementDef.tag;

          return (
            <div className="grouped-elements" key={field.id || i}>
              {Array.from({ length: field.amount }, (_, j) => {
                const name = field.name[j];
                const id = field.id[j];
                // Spread aria props safely to avoid runtime errors if elementDef.aria is missing or null
                let ariaProps = elementDef.aria ? { ...elementDef.aria } : {};
                // Allow field-specific aria overrides for inherited elements (e.g., search gets role="searchbox")
                const overrideConfig =
                  elementDef['inherit-overrides']?.[field.type];

                if (overrideConfig && overrideConfig.aria) {
                  ariaProps = { ...ariaProps, ...overrideConfig.aria };
                }

                // Build aria attributes object with defensive checks for undefined/null values
                const ariaAttributes = {};

                if (ariaProps.role !== undefined && ariaProps.role !== null) {
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
                  ariaAttributes['aria-required'] = ariaProps['aria-required'];
                }

                const Tagprobs = {
                  className: elementDef['default-class'],
                  name: name,
                  ...ariaAttributes,
                  ...(id && id !== '!/' && { id: id }),
                  ...(elementDef['supports-placeholder'] && {
                    placeholder: field.placeholder[j]
                  }),
                  ...(elementDef['supports_type'] && { type: field.type }),
                  ...(elementDef['supports_autocomplete'] && {
                    autoComplete:
                      field.type === 'password' ? 'current-password' : 'on'
                  })
                };

                if (elementDef['requires-options'] && Tag === 'select') {
                  return (
                    <Tag
                      key={j}
                      {...Tagprobs}
                      onChange={(e) => handleInputChange(name, e.target.value)}
                    >
                      <option>h3</option>
                    </Tag>
                  );
                }

                return (
                  <Tag
                    key={j}
                    {...Tagprobs}
                    onChange={(e) => handleInputChange(name, e.target.value)}
                  />
                );
              })}
            </div>
          );
        })}
        {currentType.submit && (
          <button className="modal-btn" onClick={() => handleSubmit()}>
            {currentType.submitLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export default Modal;
