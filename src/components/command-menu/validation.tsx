import { GuardStatus, allowsNull } from '../../utils/DyvixGuard';
import { ValidateAndLoadJSON } from '../../utils/Smart Json Caching/SJCManager';
import type { StateSetter } from '../../utils/Smart Json Caching/SJCManager';
import type {
  DyvixCommand,
  DyvixCommandMenuAnimation,
  DyvixCommandMenuThemes
} from './dependencies/command-menu.types';

const component = 'command-menu';
const CacheMapping = {
  theme: {
    jsonpath: '../../components/command-menu/dependencies/themes.json',
    csspath: '../../components/command-menu/dependencies/style/themes.css'
  },
  animation: {
    jsonpath: '../../registry/animations.json',
    csspath: null
  }
};

export async function ValidateCommandMenu(
  commands: DyvixCommand[] | undefined,
  animation: DyvixCommandMenuAnimation | null | undefined,
  theme: DyvixCommandMenuThemes | null | undefined,
  callback: StateSetter,
  instance: any
) {
  let normalizedAnimation = animation?.trim().toLowerCase() || '';
  const trimedTheme = theme?.trim();
  const normalizedTheme = trimedTheme
    ? trimedTheme.charAt(0).toUpperCase() + trimedTheme.slice(1)
    : '';

  const isTheme = await ValidateAndLoadJSON(
    CacheMapping,
    normalizedTheme,
    callback,
    'theme',
    component,
    instance
  );
  if (normalizedTheme && isTheme.status && !normalizedAnimation) {
    normalizedAnimation = (isTheme as any)?.config?.theme['default-animation'];
  }
  const isAnimation = await ValidateAndLoadJSON(
    CacheMapping,
    normalizedAnimation,
    callback,
    'animation',
    component
  );

  if (!isAnimation.status && !allowsNull(normalizedAnimation)) {
    return {
      status: GuardStatus.Error,
      error: 'Please provide a valid animation.'
    };
  }

  if (commands) {
    if (!Array.isArray(commands)) {
      return {
        status: GuardStatus.Error,
        error: 'Command registry expects an array of command objects.'
      };
    }

    const checkedCommands = new Set<string>([]);

    for (const command of commands) {
      if (checkedCommands.has(command.name)) {
        return {
          status: GuardStatus.Error,
          error: `Command names and aliases are expected to be unique (conflict on "${command.name}").`
        };
      }
      checkedCommands.add(command.name);
      if (command.aliases) {
        for (const alias of command.aliases) {
          if (checkedCommands.has(alias)) {
            return {
              status: GuardStatus.Error,
              error: `Command names and aliases are expected to be unique (conflict on alias "${alias}" in command "${command.name}").`
            };
          }
          checkedCommands.add(alias);
        }
      }
      if (typeof command.description !== 'string') {
        return {
          status: GuardStatus.Error,
          error: `Command descriptions must be provided as string.`
        };
      }
      if (typeof command.usage !== 'string' && command.usage !== undefined) {
        return {
          status: GuardStatus.Error,
          error: `Command usage must be provided as string.`
        };
      }
      if (typeof command.execute !== 'function') {
        return {
          status: GuardStatus.Error,
          error: `Command execute prop must be provided as function.`
        };
      }
    }
  }

  return { status: GuardStatus.Success };
}
