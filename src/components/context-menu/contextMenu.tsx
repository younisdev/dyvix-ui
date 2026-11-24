import React from 'react';
import './dependencies/style/style.css';
import { EvaluateFailure, GuardStatus } from '../../utils/DyvixGuard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ConstructClasses, SmartPropsSplitting } from '../../utils/utils';
import type {
  DyvixContextMenuItemConfig,
  DyvixContextMenuProps
} from './dependencies/context-menu.types';
import { ValidateContextMenu } from './validation';
import DyvixContextMenuItem from './DyvixContextMenuItem';
import DyvixContextMenuSeparator from './DyvixContextMenuSeparator';
import DyvixContextMenuGroup from './DyvixContextMenuGroup';

export const DyvixContextMenuContext = React.createContext<{
  close: () => void;
} | null>(null);

const DyvixContextMenu = Object.assign(
  React.forwardRef<HTMLDivElement, DyvixContextMenuProps>(
    (
      {
        children,
        items,
        animation,
        timeline,
        theme,
        overrides,
        style,
        className,
        ...rest
      },
      ref
    ) => {
      const internalRef = React.useRef<HTMLDivElement | null>(null);
      React.useImperativeHandle(
        ref,
        () => internalRef.current as HTMLDivElement
      );
      const addedToTimeLineRef = React.useRef<{
        theme: string | null;
        animation: string | null;
      } | null>(null);

      const controllerRef = React.useRef<HTMLSpanElement | null>(null);
      const [rawCord, setRawCords] = React.useState({ x: 0, y: 0 });
      const [computedCord, setComputedCords] = React.useState({ x: 0, y: 0 });
      const [mounted, setMounted] = React.useState(false);
      const [status, SetStatus] = React.useState<
        'idle' | 'entering' | 'leaving'
      >('idle');
      const [configs, SetConfig] = React.useState({});
      const instanceId = React.useId();

      const { wrapperProps, elementProps } = SmartPropsSplitting({
        style,
        ...rest
      });
      const close = React.useCallback(() => SetStatus('leaving'), []);
      React.useEffect(() => {
        async function validate() {
          const validator = await ValidateContextMenu(
            animation,
            theme,
            children,
            items,
            SetConfig,
            instanceId
          );

          if (validator.status === GuardStatus.Error) {
            return EvaluateFailure(validator.error, validator.status);
          }
        }

        validate();
      }, [animation, children, items]);
      React.useEffect(() => {
        const parent = controllerRef.current?.parentElement;

        if (!parent) return;

        const handleContextMenu = (e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();

          setRawCords({ x: e.clientX, y: e.clientY });
          setMounted(true);
          SetStatus('entering');
        };

        parent.addEventListener('contextmenu', handleContextMenu);

        return () => {
          parent.removeEventListener('contextmenu', handleContextMenu);
        };
      }, []);

      React.useLayoutEffect(() => {
        if (!mounted || !internalRef.current) return;

        const rect = internalRef.current.getBoundingClientRect();
        const padding = 10;

        let nextX = rawCord.x;
        let nextY = rawCord.y;

        if (rawCord.x + rect.width + padding > window.innerWidth) {
          nextX = Math.max(padding, rawCord.x - rect.width);
        }

        if (rawCord.y + rect.height + padding > window.innerHeight) {
          nextY = Math.max(padding, rawCord.y - rect.height);
        }

        setComputedCords({ x: nextX, y: nextY });
      }, [rawCord, mounted]);

      React.useEffect(() => {
        if (!mounted) return;

        const handleOutsideClick = (e: MouseEvent) => {
          if (e.button !== 0) return;
          const target = e.target as Node | null;
          if (
            internalRef.current &&
            target &&
            internalRef.current.contains(target)
          ) {
            return;
          }
          SetStatus('leaving');
        };
        const handleExitClick = (e: KeyboardEvent) => {
          if (e.key !== 'Escape') return;
          e.preventDefault();
          SetStatus('leaving');
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('keydown', handleExitClick);
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
          document.removeEventListener('keydown', handleExitClick);
        };
      }, [mounted]);

      const compiledChildren = React.useMemo(() => {
        if (children || !items) return children;

        const renderItems = (
          entries: DyvixContextMenuItemConfig[],
          index: string,
          separated?: boolean
        ): React.ReactElement[] =>
          entries.flatMap((ele, eleIndex) => {
            const renderedProps = {
              ...(ele.href && { href: ele.href }),
              ...(ele.onClick && { onClick: ele.onClick }),
              ...(ele.disabled !== undefined && { disabled: ele.disabled })
            };
            const itemEl = (
              <DyvixContextMenuItem
                key={`${index}-${eleIndex}`}
                {...renderedProps}
              >
                {ele.label}
              </DyvixContextMenuItem>
            );

            if (separated && eleIndex < entries.length - 1) {
              return [
                itemEl,
                <DyvixContextMenuSeparator key={`sep-${index}-${eleIndex}`} />
              ];
            }

            return [itemEl];
          });

        return items?.map((entry, index) => {
          const type = entry.type;

          if (type === 'separator') {
            return <DyvixContextMenuSeparator key={`separator-${index}`} />;
          }

          if (type === 'group') {
            const result = renderItems(
              entry.items,
              `group-item-${index}`,
              entry.separated
            );
            return (
              <DyvixContextMenuGroup key={`group-${index}`}>
                {result}
              </DyvixContextMenuGroup>
            );
          }

          return renderItems([entry], `item-${index}`)[0];
        });
      }, [children, items]);

      const currentAnimation = animation ? (configs as any)['animation'] : null;
      const currentTheme = (configs as any)['theme'];

      useGSAP(
        () => {
          const el = internalRef.current;

          if (!el || !mounted || status === 'idle') return;

          if (!currentAnimation) {
            if (status === 'leaving') {
              setMounted(false);
            }

            SetStatus('idle');
            return;
          }

          gsap.killTweensOf(el);

          if (status === 'entering') {
            const toVars: GSAPTweenVars = {
              ...currentAnimation.to,
              duration: currentAnimation['default-duration'],
              ease: currentAnimation.ease,
              onComplete: () => {
                SetStatus('idle');
              }
            };

            if (timeline) {
              if (
                addedToTimeLineRef.current?.theme === theme &&
                addedToTimeLineRef.current?.animation === animation
              )
                return;

              timeline.fromTo(el, currentAnimation.from, toVars);
              addedToTimeLineRef.current = {
                theme: theme || null,
                animation: animation || null
              };
            } else {
              gsap.fromTo(el, currentAnimation.from, toVars);
            }
          } else if (status === 'leaving') {
            gsap.to(el, {
              ...currentAnimation.from,
              duration: currentAnimation['default-duration'],
              ease: currentAnimation.ease,
              onComplete: () => {
                setMounted(false);
                SetStatus('idle');
              }
            });
          }
        },
        {
          scope: internalRef,
          dependencies: [currentAnimation, status, mounted]
        }
      );
      const { style: splitElementStyles, ...restElementProps } = elementProps;
      const { style: splitWrapperStyles, ...restWrapperProps } = wrapperProps;
      const props = {
        ...restElementProps,
        className: ConstructClasses(
          'dyvix-context-menu',
          !currentTheme?.class ? 'dyvix-context-menu-default' : '',
          currentTheme?.class,
          className
        ),
        style: {
          ...splitElementStyles
        }
      };
      const combinedWrapperStyles = {
        position: 'fixed',
        top: computedCord.y,
        left: computedCord.x,
        ...splitWrapperStyles,
        ...overrides
      };

      return (
        <DyvixContextMenuContext.Provider value={{ close }}>
          <span aria-hidden style={{ display: 'none' }} ref={controllerRef} />
          {mounted && (
            <div
              className="dyvix-context-menu-wrapper"
              ref={internalRef}
              {...restWrapperProps}
              style={combinedWrapperStyles}
            >
              <div {...props}>{compiledChildren}</div>
            </div>
          )}
        </DyvixContextMenuContext.Provider>
      );
    }
  ),
  {
    Item: DyvixContextMenuItem,
    Group: DyvixContextMenuGroup,
    Separator: DyvixContextMenuSeparator
  }
);

DyvixContextMenu.displayName = 'DyvixContextMenu';

export default DyvixContextMenu;
