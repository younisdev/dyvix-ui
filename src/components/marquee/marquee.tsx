import React, { Children } from 'react';
import './dependencies/style/style.css';
import type { DyvixMarqueeProps } from './dependencies/marquee.types';
import DyvixMarqueeItem from './DyvixMarqueeItem';
import { EvaluateFailure, GuardStatus } from '../../utils/DyvixGuard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Version from '../../../package.json';
import { ConstructClasses, SmartPropsSplitting } from '../../utils/utils';
import { ValidateMarquee } from './validation';

const DyvixMarquee = Object.assign(
  React.forwardRef<HTMLDivElement, DyvixMarqueeProps>(
    (
      {
        children,
        items,
        background,
        color,
        className,
        animation = 'fade',
        direction = 'horizantal',
        reverse = false,
        overrides,
        theme,
        repeat = -1,
        speed = 1,
        pauseOnHover = false,
        timeline,
        style,
        ...rest
      },
      ref
    ) => {
      const instanceId = React.useId();
      const [configs, SetConfig] = React.useState({});
      const { wrapperProps, elementProps } = SmartPropsSplitting({
        style,
        ...rest
      });
      const addedToTimeLineRef = React.useRef<{
        theme: string | null;
        animation: string | null;
      } | null>(null);
      const internalRef = React.useRef<HTMLDivElement | null>(null);
      const trackRef = React.useRef<HTMLDivElement | null>(null);
      const ogContentRef = React.useRef<HTMLDivElement | null>(null);
      React.useImperativeHandle(
        ref,
        () => internalRef.current as HTMLDivElement
      );
      const [maxSize, setMaxSize] = React.useState(0);
      const [displayItems, setDisplayItems] = React.useState<{
        originalItems: React.ReactNode[];
        duplicateItems: React.ReactNode[];
      } | null>({ originalItems: [], duplicateItems: [] });

      const compiledChildren = React.useMemo(() => {
        if (children) return children;

        return items?.map((item, indx) => {
          return (
            <DyvixMarqueeItem
              key={`item-${indx}`}
              {...(item.href && { href: item.href })}
            >
              {item.label}
            </DyvixMarqueeItem>
          );
        });
      }, [children, items, direction]);
      const initialChildrenCount = React.Children.count(compiledChildren);
      const { style: splitElementStyles, ...restElementProps } = elementProps;
      const { style: splitWrapperStyles, ...restWrapperProps } = wrapperProps;
      const currentAnimation = animation ? (configs as any)['animation'] : null;
      const currentTheme = theme ? (configs as any)['theme'] : null;

      const finalizedWrapperProps = {
        className: ConstructClasses(
          'dyvix-marquee-wrapper',
          direction === 'vertical'
            ? 'dyvix-marquee-vertical'
            : 'dyvix-marquee-horizontal'
        ),
        style: {
          ...splitWrapperStyles,
          ...{
            ...(background && { '--dyvix-marquee-bg': background }),
            ...(color && { '--dyvix-marquee-color': color })
          },
          ...overrides
        },
        ...restWrapperProps
      };

      const props = {
        className: ConstructClasses(
          'dyvix-marquee',
          !currentTheme?.class ? 'dyvix-marquee-default' : '',
          className,
          currentTheme?.class
        ),
        style: {
          ...splitElementStyles
        },
        ...restElementProps
      };

      React.useEffect(() => {
        async function validate() {
          const validator = await ValidateMarquee(
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

        return () => {
          const key = `DYVIX_${Version['version']}_Marquee_theme_${instanceId}`;
          const ele = document.getElementById(key);
          if (ele) ele.remove();
        };
      }, [theme, animation]);
      React.useLayoutEffect(() => {
        if (!internalRef.current) return;

        const CalculateScreenAxisSize = () => {
          if (!internalRef.current) return;
          const axisScreenSize =
            direction === 'vertical'
              ? internalRef.current.offsetHeight
              : internalRef.current.offsetWidth;
          setMaxSize(axisScreenSize);
        };

        CalculateScreenAxisSize();

        const observe = new ResizeObserver(CalculateScreenAxisSize);

        observe.observe(internalRef.current);

        return () => observe.disconnect();
      }, [direction]);

      React.useLayoutEffect(() => {
        if (!ogContentRef.current || maxSize === 0) return;

        const childeNodes = Array.from(
          ogContentRef.current.children
        ) as HTMLElement[];

        const intialchildeNodes = childeNodes.slice(0, initialChildrenCount);

        if (intialchildeNodes.length === 0) return;

        const getCurrentSize = () => {
          let gapValue = 0;
          let currentSize = 0;
          if (ogContentRef.current) {
            intialchildeNodes.forEach((node) => {
              currentSize +=
                direction === 'vertical'
                  ? node.getBoundingClientRect().height
                  : node.getBoundingClientRect().width;
            });
            const computedStyle = window.getComputedStyle(ogContentRef.current);
            const rawGap =
              computedStyle.gap || computedStyle.columnGap || '0px';
            gapValue = parseFloat(rawGap) || 0;

            currentSize += gapValue * (intialchildeNodes.length - 1);
          }
          return { currentSize, gapValue };
        };

        const { currentSize, gapValue } = getCurrentSize();

        if (currentSize === 0) return;
        const fullSetMultiplier = Math.ceil(maxSize / currentSize);

        const childrenArray = React.Children.toArray(compiledChildren);
        let appendedSize = -gapValue;
        let singleSetItems: React.ReactNode[] = [];
        outer: for (let i = 0; i < fullSetMultiplier; i++) {
          for (let j = 0; j < intialchildeNodes.length; j++) {
            if (appendedSize >= maxSize) break outer;
            const child = intialchildeNodes[j];
            if (!child) continue;
            const childSize =
              direction === 'vertical'
                ? child.getBoundingClientRect().height
                : child.getBoundingClientRect().width;
            const effectiveSize = childSize + gapValue;
            appendedSize += effectiveSize;
            singleSetItems.push(childrenArray[j]);
          }
        }

        const finalizedItems = {
          originalItems: singleSetItems.map((item, idx) => (
            <React.Fragment key={`block1-${idx}`}>{item}</React.Fragment>
          )),
          duplicateItems: singleSetItems.map((item, idx) => (
            <React.Fragment key={`block2-${idx}`}>{item}</React.Fragment>
          ))
        };

        setDisplayItems(finalizedItems);
      }, [compiledChildren, maxSize, direction]);

      useGSAP(
        () => {
          if (!internalRef.current || !currentAnimation) return;

          const toVars: GSAPTweenVars = {
            ...currentAnimation.to,
            duration: currentAnimation['default-duration'],
            ease: currentAnimation.ease
          };
          if (timeline) {
            const normalizedTheme = theme ?? null;
            const normalizedAnimation = animation ?? null;
            if (
              addedToTimeLineRef.current?.theme === normalizedTheme &&
              addedToTimeLineRef.current?.animation === normalizedAnimation
            )
              return;

            timeline.fromTo(internalRef.current, currentAnimation.from, toVars);
            addedToTimeLineRef.current = {
              theme: normalizedTheme,
              animation: normalizedAnimation
            };
          } else {
            gsap.fromTo(internalRef.current, currentAnimation.from, toVars);
          }
        },
        { scope: internalRef, dependencies: [currentAnimation, currentTheme] }
      );

      useGSAP(
        () => {
          const track = trackRef.current;
          if (!track) return;

          gsap.killTweensOf(track);

          const baseDuration = 20 / (speed || 1);
          const targetSource = reverse ? -50 : 0;
          const targetDestination = reverse ? 0 : -50;
          const property = direction === 'vertical' ? 'yPercent' : 'xPercent';
          let activeTween = gsap.fromTo(
            track,
            { [property]: targetSource },
            {
              [property]: targetDestination,
              duration: baseDuration,
              ease: 'none',
              repeat: repeat,
              onRepeat: () => {
                gsap.set(track, {
                  [property]: targetSource
                });
              }
            }
          );

          const handleTrackOnMouseEnter = () => {
            if (pauseOnHover) {
              activeTween.pause();
            }
          };
          const handleTrackOnMouseLeave = () => {
            if (pauseOnHover) {
              activeTween.play();
            }
          };
          track.addEventListener('mouseenter', handleTrackOnMouseEnter);
          track.addEventListener('mouseleave', handleTrackOnMouseLeave);

          return () => {
            if (activeTween) activeTween.kill();
            track.removeEventListener('mouseenter', handleTrackOnMouseEnter);
            track.removeEventListener('mouseleave', handleTrackOnMouseLeave);
          };
        },
        {
          scope: trackRef,
          dependencies: [
            displayItems,
            speed,
            repeat,
            pauseOnHover,
            reverse,
            direction
          ]
        }
      );
      return (
        <div ref={internalRef} {...finalizedWrapperProps}>
          <div {...props}>
            <div className="dyvix-marquee-track" ref={trackRef}>
              <div className="dyvix-marquee-content" ref={ogContentRef}>
                {displayItems?.originalItems.length
                  ? displayItems.originalItems
                  : compiledChildren}
              </div>
              <div className="dyvix-marquee-content" aria-hidden="true" inert>
                {displayItems?.duplicateItems.length
                  ? displayItems.duplicateItems
                  : compiledChildren}
              </div>
            </div>
          </div>
        </div>
      );
    }
  ),
  { Item: DyvixMarqueeItem }
);

DyvixMarquee.displayName = 'DyvixMarquee';

export default DyvixMarquee;
