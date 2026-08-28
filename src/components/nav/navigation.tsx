import React, { type FC, type ReactNode } from 'react';
import './dependencies/style/style.css';
import { ConstructClasses, SmartPropsSplitting } from '../../utils/utils';
import DyvixNavBrand from './DyvixNavBrand';
import DyvixNavLink from './DyvixNavLink';
import DyvixNavMenu from './DyvixNavMenu';
import { EvaluateFailure, GuardStatus } from '../../utils/DyvixGuard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ValidateNavigation } from './validation';
import Version from '../../../package.json';
import type { DyvixNavProps } from './dependencies/navigation.types';

const DyvixNav = Object.assign(
  React.forwardRef<HTMLDivElement, DyvixNavProps>(
    (
      {
        children,
        className,
        animation = 'fade',
        microanimation,
        overrides,
        brand,
        items,
        theme,
        background,
        color,
        style,
        timeline,
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
      const internalRef = React.useRef<HTMLDivElement | null>(null);
      React.useImperativeHandle(
        ref,
        () => internalRef.current as HTMLDivElement
      );
      const addedToTimeLineRef = React.useRef<{
        theme: string | null;
        animation: string | null;
        subanim: string | null;
      } | null>(null);
      // only used when config-driven mode is active for microanimations
      const subRef = React.useRef<(HTMLDivElement | null)[]>([]);
      const currentAnimation = animation ? (configs as any)['animation'] : null;
      const currentMicroAnimation = microanimation
        ? (configs as any)['microanimation']
        : currentAnimation;
      const currentTheme = theme ? (configs as any)['theme'] : null;
      // Only active when config-driven mode is active
      const ConstructNav = () => {
        const brandSectionProps = {
          ...(brand?.href && { href: brand?.href }),
          ...(brand?.onClick && { onClick: brand?.onClick })
        };

        return (
          <>
            <DyvixNav.Brand
              {...brandSectionProps}
              ref={(ele) => {
                if (ele) subRef.current[0] = ele;
              }}
            >
              {brand?.label}
            </DyvixNav.Brand>
            <DyvixNav.Menu>
              {items?.map((item, index) => {
                const itemSectionProps = {
                  ...(item?.href && { href: item?.href }),
                  ...(item?.onClick && { onClick: item?.onClick }),
                  ref: (ele: HTMLDivElement | null) => {
                    if (ele) subRef.current[index + 1] = ele;
                  }
                };
                return (
                  <DyvixNav.Link {...itemSectionProps} key={index}>
                    {item.label}
                  </DyvixNav.Link>
                );
              })}
            </DyvixNav.Menu>
          </>
        );
      };

      React.useEffect(() => {
        async function validate() {
          const validator = await ValidateNavigation(
            animation,
            microanimation,
            theme,
            children,
            SetConfig,
            instanceId
          );

          if (validator.status === GuardStatus.Error) {
            return EvaluateFailure(validator.error, validator.status);
          }
        }

        validate();
        return () => {
          const key = `DYVIX_${Version['version']}_Nav_theme_${instanceId}`;
          const ele = document.getElementById(key);
          if (ele) ele.remove();
        };
      }, [animation, microanimation, theme]);

      useGSAP(
        () => {
          if (!internalRef.current || !currentAnimation) return;
          const activeTheme = theme ?? currentTheme ?? null;
          const activeAnim = animation ?? null;
          const activeSubAnim = microanimation ?? currentMicroAnimation ?? null;
          if (currentAnimation) {
            const toVar = {
              ...currentAnimation.to,
              autoAlpha: 1,
              duration: currentAnimation['default-duration'],
              ease: currentAnimation.ease
            };

            if (timeline) {
              const isMainAminCompleted =
                addedToTimeLineRef.current?.theme === activeTheme &&
                addedToTimeLineRef.current?.animation === activeAnim;
              if (!isMainAminCompleted) {
                gsap.set(internalRef.current, {
                  autoAlpha: 0,
                  ...currentAnimation.from
                });
                timeline.to(internalRef.current, toVar);
                addedToTimeLineRef.current = {
                  theme: activeTheme || null,
                  animation: activeAnim || null,
                  subanim: null
                };
              }
            } else {
              gsap.set(internalRef.current, {
                autoAlpha: 0,
                ...currentAnimation.from
              });
              gsap.to(internalRef.current, toVar);
            }
          }
          if (subRef.current.length > 0 && currentMicroAnimation) {
            const delay = currentAnimation['default-duration']
              ? currentAnimation['default-duration'] -
                currentAnimation['default-duration'] / 3.5
              : 0;
            gsap.set(subRef.current, currentMicroAnimation.from);

            if (timeline) {
              const isSecondaryAminCompleted =
                addedToTimeLineRef.current?.subanim === activeSubAnim;
              if (!isSecondaryAminCompleted) {
                timeline.to(subRef.current, {
                  ...currentMicroAnimation.to,
                  duration: 0.1,
                  ease: currentMicroAnimation.ease,
                  stagger: 0.15,
                  delay: delay
                });

                addedToTimeLineRef.current = {
                  theme: addedToTimeLineRef.current?.theme || null,
                  animation: addedToTimeLineRef.current?.animation || null,
                  subanim: activeSubAnim
                };
              }
            } else {
              gsap.to(subRef.current, {
                ...currentMicroAnimation.to,
                duration: 0.1,
                ease: currentMicroAnimation.ease,
                stagger: 0.15,
                delay: delay
              });
            }
          }
        },
        {
          scope: internalRef,
          dependencies: [
            currentAnimation,
            currentMicroAnimation,
            currentTheme,
            timeline
          ]
        }
      );
      const resultJSX = React.useMemo(
        () => children ?? ConstructNav(),
        [brand, items, children]
      );

      const { style: splitElementStyles, ...restElementProps } = elementProps;
      const { style: splitWrapperStyles, ...restWrapperProps } = wrapperProps;

      const finalizedWrapperProps = {
        className: 'dyvix-nav-wrapper',
        style: {
          visibility:
            (animation && !currentAnimation) ||
            (microanimation && !currentMicroAnimation)
              ? 'hidden'
              : 'visible',
          ...splitWrapperStyles
        } as React.CSSProperties,
        ...restWrapperProps
      };

      const props = {
        style: {
          ...(background && { '--dyvix-nav-bg': background }),
          ...(color && {
            '--dyvix-nav-color': color,
            '--dyvix-nav-link-color': color
          }),
          ...splitElementStyles
        },
        className: ConstructClasses(
          'dyvix-nav',
          !currentTheme?.class ? 'dyvix-nav-default' : '',
          className,
          currentTheme?.class
        ),
        ...restElementProps
      };

      const combinedWrapperStyle = {
        ...wrapperProps.style,
        ...overrides
      };
      return (
        <div
          ref={internalRef}
          {...finalizedWrapperProps}
          style={combinedWrapperStyle}
        >
          <nav {...props}>{resultJSX}</nav>
        </div>
      );
    }
  ),
  { Menu: DyvixNavMenu, Brand: DyvixNavBrand, Link: DyvixNavLink }
);

export default DyvixNav;
