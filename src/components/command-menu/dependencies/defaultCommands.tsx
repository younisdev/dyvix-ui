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

export const fetchCommand: DyvixCommand = {
  name: 'fetch',
  usage: 'fetch [url]',
  description: 'Sends a GET request and prints the response',
  execute: async (args, context) => {
    const [rawUrl] = args;

    if (!rawUrl) {
      context.printOutput("try 'fetch [url]' with a valid endpoint", 'Warning');
      return;
    }

    const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/i.test(rawUrl);
    const withScheme = /^https?:\/\//i.test(rawUrl)
      ? rawUrl
      : `${isLocal ? 'http' : 'https'}://${rawUrl}`;

    let url: URL;

    try {
      url = new URL(withScheme);
    } catch {
      context.printOutput(`Invalid URL: ${rawUrl}`, 'Error');
      return;
    }

    const FETCH_TIMEOUT_MS = 10_000;
    const FETCH_MAX_CHARS = 1200;

    context.printOutput(`Establishing connection with ${url.href}...`);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const res = await fetch(url, { signal: controller.signal });

      context.printOutput(
        `HTTP ${res.status} ${res.statusText}`,
        res.ok ? 'Success' : 'Error'
      );

      const contentType = res.headers.get('content-type') ?? '';
      if (contentType && !/text\/|json|xml|javascript/i.test(contentType)) {
        context.printOutput(`${contentType} (binary content not displayed)`);
        return;
      }

      let output = await res.text();

      if (/json/i.test(contentType)) {
        try {
          output = JSON.stringify(JSON.parse(output), null, 2);
        } catch {
          // not json continue and print raw
        }
      }

      if (!output) {
        context.printOutput('(empty response body)');
        return;
      }
      if (output.length > FETCH_MAX_CHARS) {
        output =
          output.slice(0, FETCH_MAX_CHARS) +
          '\n... [response truncated for length]';
      }

      context.printOutput(output);
    } catch (err) {
      const aborted = (err as Error)?.name === 'AbortError';
      context.printOutput(
        aborted
          ? `Timed out after ${FETCH_TIMEOUT_MS / 1000}s`
          : err instanceof TypeError
            ? 'Request failed. This is usually a network problem or a CORS block: the server must allow this origin.'
            : `Failed to fetch: ${err instanceof Error ? err.message : 'Unknown error'}`,
        'Error'
      );
    } finally {
      clearTimeout(timeout);
    }
  }
};
