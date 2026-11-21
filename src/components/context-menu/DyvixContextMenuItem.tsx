import React from 'react';
import './dependencies/style/style.css';
import { ConstructClasses, SmartPropsSplitting } from '../../utils/utils';
import type { DyvixContextMenuItemProps } from './dependencies/context-menu.types';
import { DyvixContextMenuContext } from './contextMenu';

const DyvixContextMenuItem = React.forwardRef<
  HTMLDivElement,
  DyvixContextMenuItemProps
>(({ children, className, href, onClick, style, overrides, ...rest }, ref) => {
  const menu = React.useContext(DyvixContextMenuContext);
  const { wrapperProps, elementProps } = SmartPropsSplitting({
    style,
    ...rest
  });

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) menu?.close();
  };

  const { style: splitElementStyles, ...restElementProps } = elementProps;
  const { style: splitWrapperStyles, ...restWrapperProps } = wrapperProps;
  const props = {
    className: ConstructClasses('dyvix-context-menu-item', className),
    ...(href && { href: href }),
    role: 'menuitem',
    tabIndex: -1,
    onClick: handleClick,
    ...(splitElementStyles && { style: splitElementStyles }),
    ...restElementProps
  };
  const Component = href ? 'a' : 'div';
  const combinedWrapperStyle = {
    ...wrapperProps.style,
    ...overrides
  };
  return (
    <div
      className="dyvix-context-menu-item-wrapper"
      ref={ref}
      {...restWrapperProps}
      style={combinedWrapperStyle}
    >
      <Component {...props}>{children}</Component>
    </div>
  );
});

export default DyvixContextMenuItem;
