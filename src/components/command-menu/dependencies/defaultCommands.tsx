import type { DyvixCommand } from './command-menu.types';

export const defaultCommands: DyvixCommand[] = [
  {
    name: 'help',
    description: 'Lists all available console commands and descriptions',
    aliases: ['?'],
    execute: (_, context) => {
      context.printOutput('--- DYVIX COMMAND REGISTRY ---', 'Log');
      context.commands.forEach((cmd) => {
        const aliasStr = cmd.aliases?.length
          ? ` [aliases: ${cmd.aliases.join(', ')}]`
          : '';
        const usageStr = cmd.usage ? ` | Usage: ${cmd.usage}` : '';
        context.printOutput(
          `${cmd.name}${aliasStr} - ${cmd.description}${usageStr}`,
          'Log'
        );
      });
    }
  },
  {
    name: 'clear',
    description: 'Clears the console log scrollback buffer',
    execute: (_, context) => {
      context.clearLogs();
    }
  },
  {
    name: 'echo',
    description: 'Prints custom text back into the console stream',
    usage: 'echo [message]',
    execute: (args, context) => {
      if (args.length === 0) {
        context.printOutput('Usage: echo [message]', 'Warning');
        return;
      }
      context.printOutput(args.join(' '), 'Log');
    }
  },
  {
    name: 'time',
    description: 'Prints current local system timestamp',
    execute: (_, context) => {
      context.printOutput(
        `System Time: ${new Date().toLocaleTimeString()}`,
        'Log'
      );
    }
  }
];
