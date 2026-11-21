import React from 'react';
import type { DyvixContextMenuGroupProps } from './dependencies/context-menu.types';
import { ConstructClasses, SmartPropsSplitting } from '../../utils/utils';

const DyvixContextMenuGroup = React.forwardRef<
  HTMLDivElement,
  DyvixContextMenuGroupProps
>(({ children, className, style, overrides, ...rest }, ref) => {
  const { wrapperProps, elementProps } = SmartPropsSplitting({
    style,
    ...rest
  });

  const { style: splitElementStyles, ...restElementProps } = elementProps;
  const { style: splitWrapperStyles, ...restWrapperProps } = wrapperProps;
  const props = {
    className: ConstructClasses('dyvix-context-menu-group', className),
    ...(splitElementStyles && { style: splitElementStyles }),
    ...restElementProps
  };
  const combinedWrapperStyle = {
    ...wrapperProps.style,
    ...overrides
  };

  return (
    <div
      className="dyvix-context-menu-group-wrapper"
      role="group"
      ref={ref}
      {...restWrapperProps}
      style={combinedWrapperStyle}
    >
      <div {...props}>{children}</div>
    </div>
  );
});

export default DyvixContextMenuGroup;
