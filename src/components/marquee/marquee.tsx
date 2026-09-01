import React from 'react';
import './dependencies/style/style.css';
import type { DyvixMarqueeProps } from './dependencies/marquee.types';
import DyvixMarqueeItem from './DyvixMarqueeItem';
import { EvaluateFailure, GuardStatus } from '../../utils/DyvixGuard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Version from '../../../package.json';
import { ConstructClasses, SmartPropsSplitting } from '../../utils/utils';

const DyvixMarquee = Object.assign(
  React.forwardRef<HTMLDivElement, DyvixMarqueeProps>(
    ({ children, className, repeat = -1, speed = 1 }, ref) => {
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
      const initialChildrenCount = React.Children.count(children);

      const finalizedWrapperProps = {
        className: 'dyvix-marquee-wrapper'
      };

      const props = {
        className: ConstructClasses(
          'dyvix-marquee',
          'dyvix-marquee-default',
          className
        )
      };

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

        const childrenArray = React.Children.toArray(children);
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
      }, [children, maxSize]);

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

          return () => {
            if (activeTween) activeTween.kill();
          };
        },
        { scope: trackRef, dependencies: [displayItems, speed, repeat] }
      );
      return (
        <div ref={internalRef} {...finalizedWrapperProps}>
          <div {...props}>
            <div className="dyvix-marquee-track" ref={trackRef}>
              <div className="dyvix-marquee-content" ref={ogContentRef}>
                {displayItems?.originalItems.length
                  ? displayItems.originalItems
                  : children}
              </div>
              <div className="dyvix-marquee-content" aria-hidden="true">
                {displayItems?.duplicateItems.length
                  ? displayItems.duplicateItems
                  : children}
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
