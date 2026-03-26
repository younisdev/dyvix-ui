export default function ExecuteValidator(value, validators) {
  for (const validator of validators) {
    const [funcName, optionParam] = validator.split('(');
    const param = optionParam ? optionParam.replace(')', '') : null;
    const func = VALIDATORS_REGISTERY[funcName];
    let result = null;

    if (func) {
      result = func(value, ...[param].filter(Boolean));
    }
    if (!result.status) return result;
  }

  return { status: true, error: null };
}

const VALIDATORS_REGISTERY = {
  isEmail: (value, options = {}) => ({
    status: /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm.test(value),
    error: 'Invalid email address'
  }),
  validatePasswd: (
    value,
    {
      minLength = 8,
      maxLength = 100,
      specialCharacters = true,
      numbers = true,
      capital = true
    } = {}
  ) => {
    let pattern = `^`;

    pattern += capital ? `(?=.*[a-z])(?=.*[A-Z])` : `(?=.*[a-z])`;

    if (numbers) pattern += `(?=.*\\d)`;
    if (specialCharacters) pattern += `(?=.*[!@#$%^&*()_\\-+=\\[\\]{};:'",.])`;

    pattern += `.{${minLength},${maxLength}}$`;

    return {
      status: new RegExp(pattern).test(value),
      error: 'Invalid password'
    };
  }
};
