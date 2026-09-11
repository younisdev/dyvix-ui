import './dependencies/style/style.css';
import { ConstructClasses } from '../../utils/utils';
import React from 'react';
import type { DyvixTableCellProps } from './dependencies/table.types';

const DyvixTableCell = React.forwardRef<HTMLTableCellElement, DyvixTableCellProps>(({ children, className, ...rest }, ref) => {

  return (
    <td className={ConstructClasses('dyvix-table-cell', className)} ref={ref} {...rest}>
      {children}
    </td>
  );
})

export default DyvixTableCell;
