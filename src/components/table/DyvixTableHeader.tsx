import './dependencies/style/style.css';
import type { DyvixTableHeaderProps } from './dependencies/table.types';
import { ConstructClasses } from '../../utils/utils';
import React from 'react';

const DyvixTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  DyvixTableHeaderProps
>(({ children, className, ...rest }, ref) => {
  return (
    <thead
      className={ConstructClasses('dyvix-table-header', className)}
      ref={ref}
      {...rest}
    >
      {children}
    </thead>
  );
});

export default DyvixTableHeader;
