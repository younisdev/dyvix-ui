import React from 'react';
import './dependencies/style/style.css';
import { ConstructClasses, SmartPropsSplitting } from '../../utils/utils';
import type { DyvixContextMenuItemProps } from './dependencies/context-menu.types';

const DyvixContextMenuItem = React.forwardRef<
  HTMLDivElement,
  DyvixContextMenuItemProps
>(({ children, className, href, onClick, style, ...rest }, ref) => {
  const { wrapperProps, elementProps } = SmartPropsSplitting({
    style,
    ...rest
  });

  const { style: splitElementStyles, ...restElementProps } = elementProps;
  const { style: splitWrapperStyles, ...restWrapperProps } = wrapperProps;
  const props = {
    className: ConstructClasses('dyvix-context-menu-item', className),
    ...(href && { href: href }),
    ...(onClick && { onClick: onClick }),
    ...(splitElementStyles && { style: splitElementStyles }),
    ...restElementProps
  };
  const Component = href ? 'a' : 'div';

  return (
    <div
      className="dyvix-context-menu-item-wrapper"
      ref={ref}
      {...restWrapperProps}
      style={{ ...splitWrapperStyles }}
    >
      <Component {...props}>{children}</Component>
    </div>
  );
});

export default DyvixContextMenuItem;
