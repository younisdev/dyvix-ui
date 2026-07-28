import type { ReactNode } from 'react';
import {
  EvaluateFailure,
  GuardStatus,
  allowsNull
} from '../../utils/DyvixGuard';
import {
  ValidatAndLoadJSON,
  type StateSetter
} from '../../utils/Smart Json Caching/SJCManager';
import type {
  DyvixConfigDataProps,
  DyvixConfigColumnsProps,
  DyvixTableThemes
} from './dependencies/table.types';

const component = 'Table';
const CacheMapping = {
  theme: {
    jsonpath: '../../components/table/dependencies/themes.json',
    csspath: '../../components/table/dependencies/style/themes.css'
  },
  animation: {
    jsonpath: '../../components/animations.json',
    csspath: null
  }
};

export async function ValidateTable<
  T extends DyvixConfigDataProps = DyvixConfigDataProps
>(
  animation: string | null,
  theme: string | null | undefined,
  children: ReactNode,
  columns: DyvixConfigColumnsProps[] | undefined,
  data: T[] | undefined,
  callback: StateSetter,
  instance: number | string
) {
  let normalizedAnimation = animation?.trim().toLowerCase() || '';
  const trimedTheme = theme?.trim();
  const normalizedTheme = trimedTheme
    ? trimedTheme.charAt(0).toUpperCase() + trimedTheme.slice(1)
    : '';

  const isTheme = await ValidatAndLoadJSON(
    CacheMapping,
    normalizedTheme,
    callback,
    'theme',
    component,
    instance
  );

  if (normalizedAnimation === '' && (isTheme as any)?.config?.theme) {
    normalizedAnimation = (isTheme as any)?.config?.theme['default-animation'];
  }

  const isAnimation = await ValidatAndLoadJSON(
    CacheMapping,
    normalizedAnimation,
    callback,
    'animation',
    component
  );

  if (!isAnimation.status && !allowsNull(normalizedAnimation)) {
    return {
      status: GuardStatus.Error,
      error: 'Please provide a valid animation.'
    };
  }
  if (!children) {
    // Validate table columns when the user is using table config-mode.

    if (!Array.isArray(columns)) {
      return {
        status: GuardStatus.Error,
        error: 'columns prop must be a valid array.'
      };
    }
    const isMalformed = columns.some(
      (col) =>
        typeof col !== 'object' ||
        col === null ||
        col.key === undefined ||
        (col.sortable !== undefined && typeof col.sortable !== 'boolean')
    );

    if (isMalformed) {
      return {
        status: GuardStatus.Error,
        error: 'All column entries must be objects containing a unique key.'
      };
    }
    const isDuplicateCol = checkDuplicates(columns, 'key');
    if (isDuplicateCol?.status === GuardStatus.Error) {
      return isDuplicateCol;
    }

    // Validate table data for table config-mode.

    if (!Array.isArray(data)) {
      return {
        status: GuardStatus.Error,
        error:
          'data prop must be a valid array of objects of keys from column prop.'
      };
    }
    if (data.length === 0) {
      return {
        status: GuardStatus.Error,
        error: 'data prop cannot be empty.'
      };
    }
    const hasNullRow = data.some(
      (row) => row === null || typeof row !== 'object'
    );

    if (hasNullRow) {
      return {
        status: GuardStatus.Error,
        error: 'All data entries must be valid objects.'
      };
    }

    const availableKeys = columns.map((col) => col.key);
    const isMismatch = data.some((row) =>
      availableKeys.some((key) => !(key in row))
    );

    if (isMismatch) {
      return {
        status: GuardStatus.Error,
        error: 'data keys do not match column keys.'
      };
    }
  }
  return { status: GuardStatus.Success };
}

function checkDuplicates(elements: Record<string, any>[], field: string) {
  let found = new Set();
  for (const element of elements) {
    const val = element[field];

    if (val === '!/') continue;
    if (found.has(val)) {
      return {
        status: GuardStatus.Error,
        error: `The column ${field} "${val}" must be unique.`
      };
    }

    found.add(val);
  }

  return { status: GuardStatus.Success };
}
