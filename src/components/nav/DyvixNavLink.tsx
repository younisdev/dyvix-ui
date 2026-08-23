import React from 'react';
import './dependencies/style/style.css';
import { ConstructClasses, SmartPropsSplitting } from '../../utils/utils';
import type { DyvixNavLinkProps } from './dependencies/navigation.types';

const DyvixNavLink = React.forwardRef<HTMLDivElement, DyvixNavLinkProps>(
  ({ children, className, href, onClick, style, overrides, ...rest }, ref) => {
    const { wrapperProps, elementProps } = SmartPropsSplitting({
      style,
      ...rest
    });

    const { style: splitElementStyles, ...restElementProps } = elementProps;
    const { style: splitWrapperStyles, ...restWrapperProps } = wrapperProps;
    const props = {
      className: ConstructClasses('dyvix-nav-link', className),
      ...(href && { href: href }),
      ...(onClick && { onClick: onClick }),
      ...(splitElementStyles && { style: splitElementStyles }),
      ...restElementProps
    };

    return (
      <div
        className="dyvix-nav-link-wrapper"
        ref={ref}
        {...restWrapperProps}
        style={{ ...splitWrapperStyles, ...overrides }}
      >
        <a {...props}>{children}</a>
      </div>
    );
  }
);

export default DyvixNavLink;
