import { validType, vaildThemes, validAnimations } from './modal';

const defaultElement = {
  type: '!/',
  placeholder: ['!/'],
  id: '!/',
  className: '!/',
  amount: 1
};
// auto generate these soon
const supportedTypes = [
  'text',
  'select',
  'email',
  'password',
  'search',
  'url',
  'tel'
];

export function SerializeData(
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
export function ValidateInput(
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
  if (!validType.includes(type)) {
    return { status: -1, error: 'Please provide a vaild type.' };
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
