import React from 'react';
import './dependencies/style/style.css';
import { EvaluateFailure, GuardStatus } from '../../utils/DyvixGuard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Version from '../../../package.json';
import { ConstructClasses, SmartPropsSplitting } from '../../utils/utils';
import type {
  CommandContext,
  DyvixCommandMenuProps,
  DyvixLog
} from './dependencies/command-menu.types';
import { defaultCommands } from './dependencies/defaultCommands';
import { ValidateCommandMenu } from './validation';

const DyvixCommandMenu = React.forwardRef<
  HTMLDivElement,
  DyvixCommandMenuProps
>(
  (
    {
      autoScroll = true,
      triggerKey = '`',
      showOnRender = true,
      background,
      color,
      className,
      commands,
      headerText,
      welcomeMessage = [
        'Welcome to Dyvix UI Console',
        'Type "help" to see available commands.'
      ],
      theme,
      overrides,
      animation = 'fade',
      timeline,
      style,
      ...rest
    },
    ref
  ) => {
    const internalRef = React.useRef<HTMLDivElement | null>(null);
    const addedToTimeLineRef = React.useRef<{
      theme: string | null;
      animation: string | null;
    } | null>(null);
    const [logs, setLogs] = React.useState<DyvixLog[]>(() => {
      if (!welcomeMessage) return [];

      const messages = Array.isArray(welcomeMessage)
        ? welcomeMessage
        : [welcomeMessage];

      return messages.map((msg) => ({
        id: `welcome-${Math.random().toString(36).substring(2, 9)}`,
        type: 'Log',
        text: msg,
        timestamp: null
      }));
    });
    const logContainerRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [configs, SetConfig] = React.useState({});
    const [visibility, SetVisibility] = React.useState<boolean>(true);
    const [status, SetStatus] = React.useState<'entering' | 'leaving'>(() =>
      showOnRender ? 'entering' : 'leaving'
    );
    const [backgroundtask, setBackgroundTask] = React.useState<boolean>(false);
    const instanceId = React.useId();

    React.useImperativeHandle(ref, () => internalRef.current as HTMLDivElement);

    const bufferRef = React.useRef<DyvixLog[]>([]);
    const scheduledRef = React.useRef<boolean>(false);
    const isDraggingRef = React.useRef<boolean>(false);
    const dragOffsetRef = React.useRef({ x: 0, y: 0 });

    const currentTheme = (configs as any)['theme'];
    const currentAnimation = animation ? (configs as any)['animation'] : null;

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
      async function validate() {
        const validator = await ValidateCommandMenu(
          animation,
          theme,
          SetConfig,
          instanceId
        );

        if (validator.status === GuardStatus.Error) {
          return EvaluateFailure(validator.error, validator.status);
        }
      }

      validate();

      return () => {
        const key = `DYVIX_${Version['version']}_command-menu_theme_${instanceId}`;
        const ele = document.getElementById(key);
        if (ele) ele.remove();
      };
    }, [animation, theme]);
    useGSAP(
      () => {
        if (!internalRef.current) return;

        if (!showOnRender && !backgroundtask) {
          gsap.set(internalRef.current, {
            autoAlpha: 0
          });

          return;
        }

        if (!currentAnimation) {
          if (status === 'leaving') {
            if (backgroundtask) return;

            SetVisibility(false);
          }

          return;
        }

        const duration = currentAnimation['default-duration'] ?? 0.3;
        const ease = currentAnimation.ease ?? 'power2.out';

        if (timeline) {
          const activeTheme = theme ?? null;
          const activeAnim = animation ?? null;
          const isCompleted =
            addedToTimeLineRef.current?.theme === activeTheme &&
            addedToTimeLineRef.current?.animation === activeAnim;

          if (status === 'entering') {
            if (!isCompleted) {
              addedToTimeLineRef.current = {
                theme: activeTheme || null,
                animation: activeAnim || null
              };

              const enterTween = gsap.fromTo(
                internalRef.current,
                { autoAlpha: 0, ...currentAnimation.from },
                { autoAlpha: 1, ...currentAnimation.to }
              );
              timeline.add(enterTween);
            }
          } else if (status === 'leaving') {
            const leavingTween = gsap.timeline().to(internalRef.current, {
              autoAlpha: 0,
              ...currentAnimation.from,
              duration: duration,
              ease: ease,
              onComplete: () => {
                if (backgroundtask) return;
                SetVisibility(false);
              }
            });
            timeline.add(leavingTween, '+=0');
            addedToTimeLineRef.current = null;
          }
          return;
        }

        if (status === 'entering') {
          gsap.fromTo(
            internalRef.current,
            { autoAlpha: 0, ...currentAnimation.from },
            { autoAlpha: 1, ...currentAnimation.to, duration, ease }
          );
        } else {
          gsap.to(internalRef.current, {
            autoAlpha: 0,
            ...currentAnimation.from,
            duration: duration,
            ease: ease,
            onComplete: () => {
              if (backgroundtask) return;
              SetVisibility(false);
            }
          });
        }
      },
      {
        scope: internalRef,
        dependencies: [currentAnimation, theme ?? null, status, timeline]
      }
    );
    React.useEffect(() => {
      if (!logContainerRef.current || !autoScroll) return;

      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }, [logs, autoScroll]);

    React.useEffect(() => {
      const handleKeydown = (e: KeyboardEvent) => {
        const isInputFocused = document.activeElement === inputRef.current;
        if (
          e.key.toLowerCase() === triggerKey.toLowerCase() &&
          !isInputFocused
        ) {
          e.preventDefault();
          setBackgroundTask(true);
          SetStatus((prev) => (prev === 'leaving' ? 'entering' : 'leaving'));
        }
      };

      window.addEventListener('keydown', handleKeydown);

      return () => window.removeEventListener('keydown', handleKeydown);
    }, [triggerKey]);

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
          command.name === splitCommand ||
          command.aliases?.includes(splitCommand)
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
        !currentTheme?.class ? 'dyvix-command-menu-default' : '',
        currentTheme?.class,
        className
      ),
      style: {
        ...splitElementStyles
      }
    };

    const combinedWrapperStyle = {
      ...wrapperProps.style,
      ...{
        ...(background && {
          '--dyvix-command-menu-bg': background,
          '--dyvix-command-menu-container-bg': background,
          '--dyvix-command-menu-header-bg': background,
          '--dyvix-command-menu-hover-border-color': background,
          '--dyvix-command-menu-border-color': background
        }),
        ...(color && { '--dyvix-command-menu-color': color })
      },
      ...overrides
    };

    return (
      <>
        {visibility && (
          <div
            className="dyvix-command-menu-wrapper"
            ref={internalRef}
            {...wrapperProps}
            style={combinedWrapperStyle}
          >
            <div {...props}>
              <h1
                className="dyvix-command-menu-header"
                onMouseDown={handleMouseDown}
              >
                <span>{headerText ?? 'Console'}</span>
                <button
                  onClick={() => {
                    setBackgroundTask(false);
                    SetStatus('leaving');
                  }}
                >
                  X
                </button>
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
                      {log?.timestamp && (
                        <span style={{ opacity: 0.7 }}>[{log.timestamp}]</span>
                      )}
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
        )}
      </>
    );
  }
);

export default DyvixCommandMenu;
