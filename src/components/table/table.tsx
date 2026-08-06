import React from 'react';
import './dependencies/style/style.css';
import DyvixTableHeader from './DyvixTableHeader';
import DyvixTableHead from './DyvixTableHead';
import DyvixTableRow from './DyvixTableRow';
import DyvixTableBody from './DyvixTableBody';
import DyvixTableCell from './DyvixTableCell';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ValidateTable } from './validation';
import { GuardStatus, EvaluateFailure } from '../../utils/DyvixGuard';
import Version from '../../../package.json';
import type {
  DyvixTableProps,
  DyvixConfigDataProps
} from './dependencies/table.types';
import { ConstructClasses, SmartPropsSplitting } from '../../utils/utils';

interface SortConfigItem {
  key: string;
  direction: 'asc' | 'desc' | 'none';
  index: number;
}

const Table = <T extends DyvixConfigDataProps = DyvixConfigDataProps>({
  children,
  className,
  animation = 'fade',
  theme,
  background,
  color,
  columns,
  data,
  style,
  ...rest
}: DyvixTableProps<T>) => {
  const instanceId = React.useId();
  const [configs, SetConfig] = React.useState({});
  const { wrapperProps, elementProps } = SmartPropsSplitting({
    style,
    ...rest
  });
  const [sortConfig, setSortConfig] = React.useState<SortConfigItem[]>([]);
  const tableRef = React.useRef(null);
  const [isValid, SetIsvalid] = React.useState(false);
  const currentAnimation = animation ? (configs as any)['animation'] : null;
  const currentTheme = theme ? (configs as any)['theme'] : null;

  const { style: splitElementStyles, ...restElementProps } = elementProps;
  const props = {
    className: ConstructClasses('dyvix-table', currentTheme?.class, className),
    style: {
      ...(background && { background: background }),
      ...(color && { color: color }),
      ...splitElementStyles
    },
    ...restElementProps
  };
  const processedData = React.useMemo(() => {
    if (!data || !columns) return [];
    if (!sortConfig.length) return data;

    return [...data].sort((a, b) => {
      for (const { key, direction } of sortConfig) {
        if (direction === 'none') continue;
        const aVal = a[key];
        const bVal = b[key];

        let result = 0;

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          result = aVal - bVal;
        } else {
          result = String(aVal).localeCompare(String(bVal));
        }

        if (result !== 0) return direction === 'asc' ? result : -result;
      }

      return 0;
    });
  }, [columns, data, isValid, sortConfig]);

  const ConstructTable = () => {
    const bodyRows = processedData.map((row) =>
      columns?.map((col) => row[col.key])
    );
    const handleSortClick = (key: string) => {
      const isfound = sortConfig?.find((config) => config['key'] === key);

      if (isfound) {
        setSortConfig((prev) =>
          prev.map((config) => {
            if (config.key !== key) return config;
            if (config.direction === 'asc')
              return { ...config, direction: 'desc' };
            if (config.direction === 'desc')
              return { ...config, direction: 'none' };
            return { ...config, direction: 'asc' };
          })
        );
      } else {
        const index = columns!.findIndex((col) => col['key'] === key);
        setSortConfig((prev) => [
          ...(prev || []),
          { key: key, direction: 'asc', index: index }
        ]);
      }
    };

    return (
      <>
        <DyvixTableHeader>
          <DyvixTableRow>
            {columns?.map((col, i) => {
              const isColumnSortable = col.sortable === true;
              const activeSort = isColumnSortable
                ? sortConfig.find((config) => config.key === col.key)
                : null;
              let sortIndicator = null;

              if (activeSort) {
                if (activeSort.direction === 'asc') {
                  sortIndicator = ' ▲';
                } else if (activeSort.direction === 'desc') {
                  sortIndicator = ' ▼';
                }
              }
              return (
                <DyvixTableHead
                  key={col.key || i}
                  {...(isColumnSortable && {
                    onClick: () => handleSortClick(col.key),
                    className: 'table-sortable'
                  })}
                >
                  {typeof col === 'string' ? col : col.label}
                  {isColumnSortable && (
                    <span className="dyvix-table-sort-icon">
                      {sortIndicator || ' ↕'}
                    </span>
                  )}
                </DyvixTableHead>
              );
            })}
          </DyvixTableRow>
        </DyvixTableHeader>
        <DyvixTableBody>
          {bodyRows.map((row, i) => {
            return (
              <DyvixTableRow key={i}>
                {row?.map((col, j) => (
                  <DyvixTableCell key={`${i}-${j}`}>{col}</DyvixTableCell>
                ))}
              </DyvixTableRow>
            );
          })}
        </DyvixTableBody>
      </>
    );
  };

  React.useEffect(() => {
    async function validate() {
      const validator = await ValidateTable(
        animation,
        theme,
        children,
        columns,
        data,
        SetConfig,
        instanceId
      );

      if (validator.status === GuardStatus.Error) {
        SetIsvalid(false);
        return EvaluateFailure(validator.error, validator.status);
      } else {
        SetIsvalid(true);
      }
    }

    validate();
    return () => {
      const key = `DYVIX_${Version['version']}_Table_theme_${instanceId}`;
      const ele = document.getElementById(key);
      if (ele) ele.remove();
    };
  }, [animation, theme, columns, data]);
  useGSAP(() => {
    if (!tableRef.current || !currentAnimation) return;

    gsap.fromTo(tableRef.current, currentAnimation.from, {
      ...currentAnimation.to,
      duration: currentAnimation['default-duration'],
      ease: currentAnimation.ease
    });
  }, [currentAnimation]);
  const resultJSX = React.useMemo(
    () => (columns && isValid ? ConstructTable() : null),
    [columns, isValid, sortConfig]
  );
  children = children ? children : resultJSX;
  return (
    <div className="dyvix-table-wrapper" ref={tableRef} {...wrapperProps}>
      <table {...props}>{children}</table>
    </div>
  );
};

type DyvixTableComponents = typeof Table & {
  Header: typeof DyvixTableHeader;
  Head: typeof DyvixTableHead;
  Row: typeof DyvixTableRow;
  Body: typeof DyvixTableBody;
  Cell: typeof DyvixTableCell;
};

const DyvixTable = Table as DyvixTableComponents;

DyvixTable.Body = DyvixTableBody;
DyvixTable.Cell = DyvixTableCell;
DyvixTable.Head = DyvixTableHead;
DyvixTable.Header = DyvixTableHeader;
DyvixTable.Row = DyvixTableRow;

export default DyvixTable;
