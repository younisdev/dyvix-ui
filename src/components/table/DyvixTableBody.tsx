import React from 'react';
import './dependencies/style/style.css';
import type { DyvixTableBodyProps } from './dependencies/table.types';
import { ConstructClasses } from '../../utils/utils';

const DyvixTableBody = React.forwardRef<HTMLTableSectionElement, DyvixTableBodyProps>(
  ({ children, className, ...rest }, ref) => {

    return (
      <tbody className={ConstructClasses('dyvix-table-body', className)} ref={ref} {...rest}>
        {children}
      </tbody>
    );
  }
);

export default DyvixTableBody;
