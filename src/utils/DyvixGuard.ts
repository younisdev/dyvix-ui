export const GuardStatus = {
  Error: 'error',
  Warn: 'warn',
  Log: 'log',
  Success: 'success'
} as const;
const PREFIX = '[DyvixUI]';

type statusType = (typeof GuardStatus)[keyof typeof GuardStatus];
export function EvaluateFailure(message: string, status: statusType) {
  const formatedmsg = `${PREFIX} - ${message}`;

  switch (status) {
    case GuardStatus.Error:
      console.error(formatedmsg);
      return null;
    case GuardStatus.Warn:
      console.warn(formatedmsg);
      return null;
    case GuardStatus.Log:
      console.log(formatedmsg);
      return null;
    case GuardStatus.Success:
      return null;
  }
}

export function allowsNull(value: any) {
  return value !== null;
}
