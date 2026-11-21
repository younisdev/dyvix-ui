import React from 'react';
import type { DyvixContextMenuSeparatorProps } from './dependencies/context-menu.types';
import { ConstructClasses, SmartPropsSplitting } from '../../utils/utils';

const DyvixContextMenuSeparator = React.forwardRef<
  HTMLDivElement,
  DyvixContextMenuSeparatorProps
>(({ className, style, ...rest }, ref) => {
  const { wrapperProps, elementProps } = SmartPropsSplitting({
    style,
    ...rest
  });

  const { style: splitElementStyles, ...restElementProps } = elementProps;
  const { style: splitWrapperStyles, ...restWrapperProps } = wrapperProps;
  const props = {
    className: ConstructClasses('dyvix-context-menu-separator', className),
    ...(splitElementStyles && { style: splitElementStyles }),
    ...restElementProps
  };

  return (
    <div
      className="dyvix-context-menu-separator-wrapper"
      ref={ref}
      {...restWrapperProps}
      style={{ ...splitWrapperStyles }}
    >
      <span role="separator" {...props} />
    </div>
  );
});

export default DyvixContextMenuSeparator;
