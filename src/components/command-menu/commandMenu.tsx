import React from 'react';
import './dependencies/style/style.css';
import { EvaluateFailure, GuardStatus } from '../../utils/DyvixGuard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ConstructClasses, SmartPropsSplitting } from '../../utils/utils';
import type { DyvixCommandMenuProps } from './dependencies/command-menu.types';

interface Dyvixlogs {
  id: string;
  type: 'Error' | 'Warning' | 'Log';
  text: any;
  timestamp: string;
}

const DyvixCommandMenu = React.forwardRef<
  HTMLDivElement,
  DyvixCommandMenuProps
>(({ autoScroll = true, style, className, ...rest }, ref) => {
  const internalRef = React.useRef<HTMLDivElement | null>(null);
  const [logs, setLogs] = React.useState<Dyvixlogs[]>([]);
  const logContainerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useImperativeHandle(ref, () => internalRef.current as HTMLDivElement);

  const bufferRef = React.useRef<Dyvixlogs[]>([]);
  const scheduledRef = React.useRef<boolean>(false);
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
  }

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
        <h1 className="dyvix-command-menu-header">
          <span>Console</span>
          <button>X</button>
        </h1>
        <div className="dyvix-command-menu-container" ref={logContainerRef} onClick={handelContainerClick}>
          {logs.map((log: Dyvixlogs) => {
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
          <input className={`dyvix-command-menu-button`} type='text' ref={inputRef} />
        </div>
      </div>
    </div>
  );
});

export default DyvixCommandMenu;
