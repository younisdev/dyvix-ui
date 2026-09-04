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
        className,
        animation = 'fade',
        repeat = -1,
        speed = 1,
        pauseOnHover,
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
      }, [children, items]);
      const initialChildrenCount = React.Children.count(compiledChildren);
      const { style: splitElementStyles, ...restElementProps } = elementProps;
      const { style: splitWrapperStyles, ...restWrapperProps } = wrapperProps;
      const finalizedWrapperProps = {
        className: 'dyvix-marquee-wrapper',
        style: {
          ...splitWrapperStyles
        },
        ...restWrapperProps
      };

      const props = {
        className: ConstructClasses(
          'dyvix-marquee',
          'dyvix-marquee-default',
          className
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
      }, []);

      const currentAnimation = animation ? (configs as any)['animation'] : null;
      const currentTheme = null;
      React.useLayoutEffect(() => {
        if (!internalRef.current) return;

        const CalculateScreenWidth = () => {
          if (!internalRef.current) return;
          setMaxSize(internalRef.current.offsetWidth | 0);
        };

        CalculateScreenWidth();

        const observe = new ResizeObserver(CalculateScreenWidth);

        observe.observe(internalRef.current);

        return () => observe.disconnect();
      }, []);

      React.useLayoutEffect(() => {
        if (!ogContentRef.current || maxSize === 0) return;

        const childeNodes = Array.from(
          ogContentRef.current.children
        ) as HTMLElement[];

        const intialchildeNodes = childeNodes.slice(0, initialChildrenCount);

        if (intialchildeNodes.length === 0) return;

        const getCurrentWidth = () => {
          let gapValue = 0;
          let currentWidth = 0;
          if (ogContentRef.current) {
            intialchildeNodes.forEach((node) => {
              currentWidth += node.getBoundingClientRect().width;
            });
            const computedStyle = window.getComputedStyle(ogContentRef.current);
            const rawGap =
              computedStyle.gap || computedStyle.columnGap || '0px';
            gapValue = parseFloat(rawGap) || 0;

            currentWidth += gapValue * (intialchildeNodes.length - 1);
          }
          return { currentWidth, gapValue };
        };

        const { currentWidth, gapValue } = getCurrentWidth();

        if (currentWidth === 0) return;
        const fullSetMultiplier = Math.ceil(maxSize / currentWidth);

        const childrenArray = React.Children.toArray(compiledChildren);
        let appendedWidth = -gapValue;
        let singleSetItems: React.ReactNode[] = [];
        outer: for (let i = 0; i < fullSetMultiplier; i++) {
          for (let j = 0; j < intialchildeNodes.length; j++) {
            if (appendedWidth >= maxSize) break outer;
            const child = intialchildeNodes[j];
            if (!child) continue;

            const effectiveWidth =
              child.getBoundingClientRect().width + gapValue;
            appendedWidth += effectiveWidth;
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
      }, [compiledChildren, maxSize]);

      useGSAP(
        () => {
          if (!internalRef.current || !currentAnimation) return;

          const toVars: GSAPTweenVars = {
            ...currentAnimation.to,
            duration: currentAnimation['default-duration'],
            ease: currentAnimation.ease
          };
          const theme = null;
          if (timeline) {
            if (
              addedToTimeLineRef.current?.theme === theme &&
              addedToTimeLineRef.current?.animation === animation
            )
              return;

            timeline.fromTo(internalRef.current, currentAnimation.from, toVars);
            addedToTimeLineRef.current = {
              theme: theme || null,
              animation: animation || null
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

          let activeTween = gsap.to(track, {
            xPercent: -50,
            duration: 20,
            ease: 'none',
            repeat: repeat
          });

          activeTween.timeScale(speed);

          const handleTrackOnMouseEnter = () => {
            if (pauseOnHover) {
              activeTween.pause();
            }
          };
          const handleTrackOnMouseLeave = () => {
            if (pauseOnHover) {
              activeTween.resume();
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
          dependencies: [displayItems, speed, repeat, pauseOnHover]
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
