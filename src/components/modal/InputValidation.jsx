import { validType, eleData, validRules } from './modal';
import {
  EvaluateFailure,
  GaurdStatus,
  allowsNull
} from '../../utils/DyvixGuard';
import { isValidRegex } from './dependencies/validator/validators';
import { ValidatAndLoadJSON } from '../../utils/Smart Json Caching/SJCManager';

const CacheMapping = {
  theme: {
    jsonpath: '../../components/modal/dependencies/themes.json',
    csspath: '../../components/modal/dependencies/style/themes.css'
  },
  animation: {
    jsonpath: '../../components/animations.json',
    csspath: null
  },
  preset: {
    jsonpath: '../../components/modal/dependencies/presets.json',
    csspath: null
  },
  types: {
    jsonpath: '../../components/modal/dependencies/types.json',
    csspath: null
  }
};
const component = 'Modal';
const defaultElement = {
  type: '!/',
  placeholder: ['!/'],
  id: '!/',
  match: '!/',
  className: '!/',
  validation: '!/',
  amount: 1
};
// auto generate these soon
const supportedTypes = [
  'text',
  'select',
  'd-select',
  'autocomplete',
  'email',
  'password',
  'search',
  'url',
  'tel',
  'checkbox',
  'textarea'
];
let config = null;

export async function SerializeData(
  title,
  type,
  elements,
  preset,
  theme,
  animation,
  Id,
  Class,
  onSubmit,
  callback,
  instance
) {
  const validator = await ValidateInput(
    title,
    type,
    elements,
    preset,
    theme,
    animation,
    Id,
    Class,
    onSubmit,
    callback,
    instance
  );

  if (validator.status === GaurdStatus.Error) {
    return EvaluateFailure(validator.error, validator.status);
  }
  const presetData = config.find((item) => item.preset);
  const finalElements = preset !== '!/' ? presetData?.preset?.fields : elements;
  const normalizedElements = normalizeElements(
    finalElements?.map((ele) => ({ ...defaultElement, ...ele }))
  );
  const eleValidator = validateElements(normalizedElements);

  if (eleValidator.status === GaurdStatus.Error) {
    return EvaluateFailure(eleValidator.error, eleValidator.status);
  }
  return normalizedElements;
}
export async function ValidateInput(
  title,
  type,
  elements,
  preset,
  theme,
  animation,
  Id,
  Class,
  onSubmit,
  callback,
  instance
) {
  const isTheme = await ValidatAndLoadJSON(
    CacheMapping,
    theme,
    callback,
    'theme',
    component,
    instance
  );
  if (animation === '!/') {
    animation = isTheme.config.theme['default-animation'];
  }
  const [isAnimation, isPreset] = await Promise.all([
    ValidatAndLoadJSON(
      CacheMapping,
      animation,
      callback,
      'animation',
      component
    ),
    ValidatAndLoadJSON(CacheMapping, preset, callback, 'preset', component)
  ]);

  if (preset !== '!/') {
    if (!isPreset.status) {
      return {
        status: GaurdStatus.Error,
        error: 'Please provide a valid preset.'
      };
    }
  }

  if (animation !== '!/' && !isAnimation.status && allowsNull(animation)) {
    return {
      status: GaurdStatus.Error,
      error: 'Please provide a vaild animation.'
    };
  }
  if (!isTheme.status) {
    return {
      status: GaurdStatus.Error,
      error: 'Please provide a vaild theme.'
    };
  }

  config = [isTheme.config, isAnimation.config, isPreset.config];

  if (onSubmit !== undefined && typeof onSubmit !== 'function') {
    return {
      status: GaurdStatus.Error,
      error: 'onSubmit should be provided as a function.'
    };
  }
  if (preset !== '!/') return { status: GaurdStatus.Success };
  if (title === '!/') {
    return { status: GaurdStatus.Error, error: 'Please provide a title' };
  }
  if (!validType.includes(type)) {
    return { status: GaurdStatus.Error, error: 'Please provide a vaild type.' };
  }
  if (
    !Array.isArray(elements) ||
    !elements.every((ele) => typeof ele === 'object')
  ) {
    return {
      status: GaurdStatus.Error,
      error: 'Element should be provided as an array of objects.'
    };
  }

  return { status: GaurdStatus.Success };
}
export function validateElements(elements) {
  const MAX_ROWS = 9;

  if (elements?.length > MAX_ROWS) {
    console.warn(
      `[Dyvix UI] Maximum of ${MAX_ROWS} rows allowed. Extra rows will be ignored.`
    );

    elements?.splice(MAX_ROWS); // trims array IN-PLACE
  }
  for (const element of elements) {
    const currentType =
      eleData.find((e) => e.element === element.type) ||
      eleData.find((e) => e['inherited-element']?.includes(element.type));

    if (!supportedTypes.includes(element.type)) {
      return {
        status: GaurdStatus.Error,
        error: 'Elements should include a valid type.'
      };
    }
    if (currentType['requires-options']) {
      if (!element.options || element.options.length === 0) {
        return {
          status: GaurdStatus.Error,
          error: `Field '${element.name}' requires an options array.`
        };
      }

      if (
        element.amount > 1 &&
        (!Array.isArray(element.options) ||
          element.options.length !== element.amount)
      ) {
        return {
          status: GaurdStatus.Error,
          error: `Amount mismatch for '${element.name}'. Expected ${element.amount} option sets.`
        };
      }
    }
    if (element.amount < 1 || element.amount > 3) {
      return {
        status: GaurdStatus.Error,
        error: 'Element amount should be positive and less than 3.'
      };
    } else if (element.amount > 1) {
      if (
        !Array.isArray(element.placeholder) ||
        element.placeholder.length !== element.amount
      ) {
        return {
          status: GaurdStatus.Error,
          error:
            'Element placeholder should be provided as an array of the same length as the provided amount.'
        };
      }
      if (
        !Array.isArray(element.name) ||
        element.name.length !== element.amount
      ) {
        return {
          status: GaurdStatus.Error,
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
          status: GaurdStatus.Error,
          error:
            'Element placeholder should be a string or an array of length 1.'
        };
      }
      if (!(Array.isArray(element.name) && element.name.length === 1)) {
        return {
          status: GaurdStatus.Error,
          error: 'Element name should be a string or an array of length 1.'
        };
      }
    }

    // Handels Validator engine validator
    // Supports regex
    const rules = Array.isArray(element.validation)
      ? element.validation
      : [element.validation];

    if (rules.length > element.amount) {
      return {
        status: GaurdStatus.Error,
        error: `Validation overflow: maximum of amount of ${element.amount} reached.`
      };
    }

    for (const rule of rules) {
      if (rule === '!/') break;
      if (!rule || typeof rule !== 'string') continue;

      if (rule.startsWith('$R')) {
        const [pattern, customError] = rule.slice(2).split('|');

        if (!isValidRegex(pattern)) {
          return {
            status: GaurdStatus.Error,
            error: `Invalid Regular Expression was provided.`
          };
        }
      } else if (!validRules.includes(rule)) {
        return {
          status: GaurdStatus.Error,
          error: `'${rule}' is not a recognized validator.`
        };
      }
    }
    if (element.match && element.match !== '!/') {
      const matchTargets =
        typeof element.match === 'string' ? [element.match] : element.match;
      for (const matchId of matchTargets) {
        if (matchId === '!/') continue;
        const exist = elements.find((e) =>
          Array.isArray(e.id) ? e.id.includes(matchId) : e.id === matchId
        );
        if (!exist) {
          return {
            status: GaurdStatus.Error,
            error: `'${matchId}' is not a recognized target for matching.`
          };
        }
      }
    }
  }

  const isDuplicateName = checkDuplicates(elements, 'name');
  const isDuplicateId = checkDuplicates(elements, 'id');

  if (isDuplicateName?.status === GaurdStatus.Error) {
    return isDuplicateName;
  }
  if (isDuplicateId?.status === GaurdStatus.Error) {
    return isDuplicateId;
  }

  return { status: GaurdStatus.Success };
}
export function normalizeElements(elements) {
  return elements?.map((ele) => ({
    ...ele,
    placeholder:
      typeof ele.placeholder === 'string' ? [ele.placeholder] : ele.placeholder,
    name: typeof ele.name === 'string' ? [ele.name] : ele.name,
    id: typeof ele.id === 'string' ? [ele.id] : ele.id,
    validation:
      typeof ele.validation === 'string' ? [ele.validation] : ele.validation,
    match: typeof ele.match === 'string' ? [ele.match] : ele.match
  }));
}
function checkDuplicates(elements, field) {
  let found = new Set();

  for (const element of elements) {
    const currentFields = element[field];

    for (const val of currentFields) {
      if (val === '!/') continue;
      if (found.has(val)) {
        return {
          status: GaurdStatus.Error,
          error: `Element ${field} should be unique.`
        };
      }

      found.add(val);
    }
  }

  return { status: GaurdStatus.Success };
}
