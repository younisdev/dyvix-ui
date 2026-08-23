import React, { type FC, type ReactNode } from 'react';
import './dependencies/style/style.css';
import { ConstructClasses } from '../../utils/utils';
import type { DyvixNavMenuProps } from './dependencies/navigation.types';

const DyvixNavMenu: FC<DyvixNavMenuProps> = ({
  children,
  className,
  overrides
}) => {
  return (
    <ul className={ConstructClasses('dyvix-nav-menu', className)}>
      {children}
    </ul>
  );
};

export default DyvixNavMenu;
