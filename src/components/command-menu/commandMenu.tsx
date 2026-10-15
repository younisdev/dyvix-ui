import React from 'react';
import './dependencies/style/style.css';
import { EvaluateFailure, GuardStatus } from '../../utils/DyvixGuard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ConstructClasses, SmartPropsSplitting } from '../../utils/utils';
import type {
  CommandContext,
  DyvixCommandMenuProps,
  DyvixLog
} from './dependencies/command-menu.types';
import { defaultCommands } from './dependencies/defaultCommands';

const DyvixCommandMenu = React.forwardRef<
  HTMLDivElement,
  DyvixCommandMenuProps
>(({ autoScroll = true, style, className, commands, ...rest }, ref) => {
  const internalRef = React.useRef<HTMLDivElement | null>(null);
  const [logs, setLogs] = React.useState<DyvixLog[]>([]);
  const logContainerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useImperativeHandle(ref, () => internalRef.current as HTMLDivElement);

  const bufferRef = React.useRef<DyvixLog[]>([]);
  const scheduledRef = React.useRef<boolean>(false);
  const isDraggingRef = React.useRef<boolean>(false);
  const dragOffsetRef = React.useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).tagName === 'button') return;

    isDraggingRef.current = true;

    if (internalRef.current) {
      const rect = internalRef.current.getBoundingClientRect();

      dragOffsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!internalRef.current || !isDraggingRef.current) return;

    const x = e.clientX - dragOffsetRef.current.x;
    const y = e.clientY - dragOffsetRef.current.y;

    internalRef.current.style.left = `${x}px`;
    internalRef.current.style.top = `${y}px`;
    internalRef.current.style.margin = '0';
  };
  const handleMouseUp = (e: MouseEvent) => {
    isDraggingRef.current = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };
  const pushLog = React.useCallback(
    (type: 'Error' | 'Warning' | 'Log' = 'Log', ...args: any[]) => {
      const formattedText = args
        .map((arg) => {
          if (arg instanceof Error) return arg.stack || arg.message;

          if (typeof arg === 'object' && arg !== null) {
            try {
              return JSON.stringify(arg);
            } catch {
              return `[Object]`;
            }
          }
          return String(arg);
        })
        .join(' ');

      bufferRef.current.push({
        id: Math.random().toString(36).substring(2, 9),
        text: formattedText,
        type: type,
        timestamp: new Date().toLocaleTimeString()
      });

      if (scheduledRef.current) return;
      scheduledRef.current = true;

      queueMicrotask(() => {
        scheduledRef.current = false;
        const batch = bufferRef.current.splice(0);
        if (batch.length > 0) {
          setLogs((prev) => [...prev, ...batch]);
        }
      });
    },
    []
  );
  React.useEffect(() => {
    inputRef.current?.focus();
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    const handleGlobalError = (e: ErrorEvent) => {
      pushLog(
        'Error',
        `[CRASH] ${e.message} (${e.filename}:${e.lineno}:${e.colno})`
      );
    };

    const handleUnhandledRejection = (e: PromiseRejectionEvent) => {
      const reason =
        e.reason instanceof Error ? e.reason.message : String(e.reason);
      pushLog('Error', `[UNHANDLED REJECTION] ${reason}`);
    };

    console.log = (...args: any[]) => {
      originalLog.apply(console, args);

      pushLog('Log', ...args);
    };

    console.warn = (...args: any[]) => {
      originalWarn.apply(console, args);
      pushLog('Warning', ...args);
    };

    console.error = (...args: any[]) => {
      originalError.apply(console, args);

      pushLog('Error', ...args);
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection
      );
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  React.useEffect(() => {
    if (!logContainerRef.current || !autoScroll) return;

    logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
  }, [logs, autoScroll]);

  const handelContainerClick = () => {
    inputRef.current?.focus();
  };

  const executeAction = (cmd: string) => {
    const [splitCommand, ...args] = cmd.split(/\s+/);

    pushLog('Log', cmd);
    if (!splitCommand) {
      return;
    }
    const allCommands = [...defaultCommands, ...(commands || [])];

    const action = allCommands?.find(
      (command) =>
        command.name === splitCommand || command.aliases?.includes(splitCommand)
    );

    if (!action) {
      pushLog('Error', `Unknown command: ${splitCommand}`);
      return;
    }
    if (action.name === 'clear') {
      setLogs([]);
      bufferRef.current = [];
      return;
    }
    const context: CommandContext = {
      clearLogs: () => setLogs([]),
      printOutput: (message, type = 'Log') => pushLog(type, message),
      commands: allCommands
    };

    try {
      const result = action.execute(args, context);

      if (typeof result === 'string') {
        pushLog('Log', result);
      } else if (result instanceof Promise) {
        result
          .then((asyncResult) => {
            if (typeof asyncResult === 'string') {
              pushLog('Log', asyncResult);
            }
          })
          .catch((asyncError) => {
            pushLog('Error', `Command error: ${asyncError}`);
          });
      }
    } catch (error) {
      pushLog('Error', `Command error: ${error}`);
    }
  };

  const handleInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = e.currentTarget.value.trim();
      if (!command) return;

      executeAction(command);
      e.currentTarget.value = '';
    }
  };

  const { wrapperProps, elementProps } = SmartPropsSplitting({
    style,
    ...rest
  });

  const { style: splitElementStyles, ...restElementProps } = elementProps;
  const props = {
    ...restElementProps,
    className: ConstructClasses(
      'dyvix-command-menu',
      'dyvix-command-menu-default',
      className
    ),
    style: {
      ...splitElementStyles
    }
  };

  return (
    <div
      className="dyvix-command-menu-wrapper"
      ref={internalRef}
      {...wrapperProps}
      style={wrapperProps.style}
    >
      <div {...props}>
        <h1 className="dyvix-command-menu-header" onMouseDown={handleMouseDown}>
          <span>Console</span>
          <button>X</button>
        </h1>
        <div
          className="dyvix-command-menu-container"
          ref={logContainerRef}
          onClick={handelContainerClick}
        >
          {logs.map((log: DyvixLog) => {
            return (
              <div
                key={log.id}
                className={`dyvix-command-menu-${log.type.toLocaleLowerCase()} dyvix-command-menu-item`}
              >
                <span style={{ opacity: 0.7 }}>[{log.timestamp}]</span>
                <span
                  style={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace'
                  }}
                >
                  {log.text}
                </span>
              </div>
            );
          })}
          <input
            className={`dyvix-command-menu-button`}
            type="text"
            ref={inputRef}
            onKeyDown={handleInputSubmit}
          />
        </div>
      </div>
    </div>
  );
});

export default DyvixCommandMenu;
