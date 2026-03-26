import elementsData from './dependencies/elements.json';
import themesData from './dependencies/themes.json';
import SelectEngine from '../select/SelectEngine';
import animationsData from '../animations.json';
import validationData from './dependencies/validator/validators.json';
import './dependencies/style/elements.css';
import './dependencies/style/themes.css';
import * as validatorsFunctions from './dependencies/validator/validators';
import ExecuteValidator from './dependencies/validator/validators';
import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const vaildThemes = themesData.map((e) => e.theme);
const validAnimations = animationsData.map((e) => e.animation);
const defaultElement = {
  type: '!/',
  placeholder: ['!/'],
  id: '!/',
  className: '!/',
  amount: 1
};
const supportedTypes = [
  'text',
  'select',
  'email',
  'password',
  'search',
  'url',
  'tel'
];
const componentsMap = { SelectEngine: SelectEngine };

function Modal({
  title,
  type,
  elements,
  theme = 'Singularity',
  animation = '!/',
  Id,
  Class,
  onSubmit
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
    SetData((prev) => ({ ...prev, [name]: value }));
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

  const currentTheme = themesData.find(
    (e) => e.theme.trim().toLowerCase() === theme.trim().toLowerCase()
  );
  const animationQuery =
    animation === '!/' ? currentTheme['default-animation'] : animation;
  const currentAnimation = animationsData.find(
    (e) =>
      e.animation.trim().toLowerCase() === animationQuery.trim().toLowerCase()
  );
  const serilaizedClass = Class + ` ${currentTheme.class}`;
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
        style={{ height: dynamicHeight, width: dynamicWidth }}
      >
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
        <button className="modal-btn" onClick={() => handleSubmit()}>
          Submit
        </button>
      </div>
    </div>
  );
}

function SerializeData(
  title,
  type,
  elements,
  theme,
  animation,
  Id,
  Class,
  onSubmit
) {
  const validator = ValidateInput(
    title,
    type,
    elements,
    theme,
    animation,
    Id,
    Class,
    onSubmit
  );

  if (validator.status !== 1) {
    console.error(validator.error);
    return null;
  }

  const normalizedElements = normalizeElements(
    elements.map((ele) => ({ ...defaultElement, ...ele }))
  );
  const eleValidator = validateElements(normalizedElements);

  if (eleValidator.status !== 1) {
    console.error(eleValidator.error);
    return null;
  }

  return normalizedElements;
}
function ValidateInput(
  title,
  type,
  elements,
  theme,
  animation,
  Id,
  Class,
  onSubmit
) {
  if (!title) {
    return { status: -1, error: 'Please provide a title' };
  }
  if (
    !Array.isArray(elements) ||
    !elements.every((ele) => typeof ele === 'object')
  ) {
    return {
      status: -1,
      error: 'Element should be provided as an array of objects.'
    };
  }
  if (animation !== '!/' && !validAnimations.includes(animation)) {
    return { status: -1, error: 'Please provide a vaild animation.' };
  }
  if (!vaildThemes.includes(theme)) {
    return { status: -1, error: 'Please provide a vaild theme.' };
  }
  if (onSubmit !== null && typeof onSubmit !== 'function') {
    return { status: -1, error: 'onSubmit should be provided as a function.' };
  }

  return { status: 1 };
}
function validateElements(elements) {
  for (const element of elements) {
    if (!supportedTypes.includes(element.type)) {
      return { status: -1, error: 'Elements should include a valid type.' };
    }
    if (element.amount < 1 || element.amount > 3) {
      return {
        status: -1,
        error: 'Element amount should be positive and less than 3.'
      };
    } else if (element.amount > 1) {
      if (
        !Array.isArray(element.placeholder) ||
        element.placeholder.length !== element.amount
      ) {
        return {
          status: -1,
          error:
            'Element placeholder should be provided as an array of the same length as the provided amount.'
        };
      }
      if (
        !Array.isArray(element.name) ||
        element.name.length !== element.amount
      ) {
        return {
          status: -1,
          error:
            'Element name should be provided as an array of the same length as the provided amount.'
        };
      }
    } else {
      if (
        !(
          Array.isArray(element.placeholder) && element.placeholder.length === 1
        )
      ) {
        return {
          status: -1,
          error:
            'Element placeholder should be a string or an array of length 1.'
        };
      }
      if (!(Array.isArray(element.name) && element.name.length === 1)) {
        return {
          status: -1,
          error: 'Element name should be a string or an array of length 1.'
        };
      }
    }
  }

  const isDuplicateName = checkDuplicates(elements, 'name');
  const isDuplicateId = checkDuplicates(elements, 'id');

  if (isDuplicateName?.status === -1) {
    return isDuplicateName;
  }
  if (isDuplicateId?.status === -1) {
    return isDuplicateId;
  }

  return { status: 1 };
}
function normalizeElements(elements) {
  return elements.map((ele) => ({
    ...ele,
    placeholder:
      typeof ele.placeholder === 'string' ? [ele.placeholder] : ele.placeholder,
    name: typeof ele.name === 'string' ? [ele.name] : ele.name,
    id: typeof ele.id === 'string' ? [ele.id] : ele.id,
    validation:
      typeof ele.validation === 'string' ? [ele.validation] : ele.validation
  }));
}
function checkDuplicates(elements, field) {
  let found = new Set();

  for (const element of elements) {
    const currentFields = element[field];

    for (const key in currentFields) {
      if (found.has(currentFields[key])) {
        return { status: -1, error: `Element ${field} should be unique.` };
      }

      found.add(currentFields[key]);
    }
  }

  return { status: 1 };
}
export default Modal;
