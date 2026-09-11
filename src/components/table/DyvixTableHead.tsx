import './dependencies/style/style.css';
import { ConstructClasses } from '../../utils/utils';
import React from 'react';
import type { DyvixTableHeadProps } from './dependencies/table.types';

const DyvixTableHead = React.forwardRef<
  HTMLTableCellElement,
  DyvixTableHeadProps
>(({ children, className, ...rest }, ref) => {
  return (
    <th
      className={ConstructClasses('dyvix-table-head', className)}
      ref={ref}
      {...rest}
    >
      {children}
    </th>
  );
});

export default DyvixTableHead;
