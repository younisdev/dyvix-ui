import { GuardStatus, allowsNull } from '../../utils/DyvixGuard';
import { ValidateAndLoadJSON } from '../../utils/Smart Json Caching/SJCManager';
import type { StateSetter } from '../../utils/Smart Json Caching/SJCManager';
import type {
  DyvixContextMenuAnimation,
  DyvixContextMenuConfigItems,
  DyvixContextMenuItemConfig
} from './dependencies/context-menu.types';
const component = 'context-menu';
const CacheMapping = {
  theme: {
    jsonpath: '../../components/context-menu/dependencies/themes.json',
    csspath: '../../components/context-menu/dependencies/style/themes.css'
  },
  animation: {
    jsonpath: '../../registry/animations.json',
    csspath: null
  }
};
const isValidItem = (entries: DyvixContextMenuItemConfig[]) => {
  return entries.some(
    (entry) =>
      typeof entry !== 'object' ||
      entry === null ||
      entry.label === undefined ||
      entry.label === null ||
      (entry.href !== undefined && typeof entry.href !== 'string') ||
      (entry.onClick !== undefined && typeof entry.onClick !== 'function') ||
      (entry.disabled !== undefined && typeof entry.disabled !== 'boolean')
  );
};

export async function ValidateContextMenu(
  animation: DyvixContextMenuAnimation | null | undefined,
  children: React.ReactNode,
  items: DyvixContextMenuConfigItems[] | undefined,
  callback: StateSetter
) {
  let normalizedAnimation = animation?.trim().toLowerCase() || '';

  const isAnimation = await ValidateAndLoadJSON(
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
    if (!Array.isArray(items) || items.length === 0) {
      return {
        status: GuardStatus.Error,
        error: 'items prop must be a valid array.'
      };
    }

    const isMalformed = items.some((entry) => {
      if (typeof entry !== 'object' || entry === null) return true;

      if (entry.type === 'separator') return false;

      if (entry.type === 'group') {
        return (
          !Array.isArray(entry.items) ||
          entry.items.length === 0 ||
          isValidItem(entry.items)
        );
      }

      if (entry.type === 'item' || entry.type === undefined) {
        return isValidItem([entry]);
      }

      return true;
    });

    if (isMalformed) {
      return {
        status: GuardStatus.Error,
        error: 'All menu item entries must be objects containing a label.'
      };
    }
  }

  return { status: GuardStatus.Success };
}
