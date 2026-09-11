import './dependencies/style/style.css';
import { ConstructClasses } from '../../utils/utils';
import React from 'react';
import type { DyvixTableRowProps } from './dependencies/table.types';

const DyvixTableRow = React.forwardRef<HTMLTableRowElement, DyvixTableRowProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <tr
        className={ConstructClasses('dyvix-table-row', className)}
        ref={ref}
        {...rest}
      >
        {children}
      </tr>
    );
  }
);

export default DyvixTableRow;
