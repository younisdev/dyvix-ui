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

interface DyvixNavComponents extends FC<DyvixNavProps> {
  Menu: typeof DyvixNavMenu;
  Brand: typeof DyvixNavBrand;
  Link: typeof DyvixNavLink;
}

const DyvixNav: DyvixNavComponents = ({
  children,
  className,
  animation = 'fade',
  microanimation,
  brand,
  items,
  theme,
  background,
  color,
  style,
  ...rest
}) => {
  const instanceId = React.useId();
  const [configs, SetConfig] = React.useState({});
  const { wrapperProps, elementProps } = SmartPropsSplitting({
    style,
    ...rest
  });
  const navigationRef = React.useRef(null);
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

  useGSAP(() => {
    if (!navigationRef.current || !currentAnimation) return;

    if (currentAnimation) {
      gsap.set(navigationRef.current, currentAnimation.from);
      gsap.to(navigationRef.current, {
        ...currentAnimation.to,
        duration: currentAnimation['default-duration'],
        ease: currentAnimation.ease
      });
    }

    if (subRef.current.length > 0 && currentMicroAnimation) {
      const delay = currentAnimation['default-duration']
        ? currentAnimation['default-duration'] -
          currentAnimation['default-duration'] / 3.5
        : 0;
      gsap.set(subRef.current, currentMicroAnimation.from);
      gsap.to(subRef.current, {
        ...currentMicroAnimation.to,
        duration: 0.1,
        ease: currentMicroAnimation.ease,
        stagger: 0.15,
        delay: delay
      });
    }
  }, [currentAnimation, currentMicroAnimation]);
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
    className: ConstructClasses('dyvix-nav', className, currentTheme?.class),
    ...restElementProps
  };

  return (
    <div ref={navigationRef} {...finalizedWrapperProps}>
      <nav {...props}>{resultJSX}</nav>
    </div>
  );
};

DyvixNav.Menu = DyvixNavMenu;
DyvixNav.Brand = DyvixNavBrand;
DyvixNav.Link = DyvixNavLink;

export default DyvixNav;
