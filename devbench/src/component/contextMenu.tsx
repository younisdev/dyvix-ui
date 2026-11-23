import { DyvixContextMenu, DyvixContextMenuItem } from '../../../src';
import type { DyvixContextMenuConfigItems } from '../../../src/components/context-menu/dependencies/context-menu.types';

export function CommandMenuTest() {
  // config driven example
  const menuItems: DyvixContextMenuConfigItems[] = [
    { label: 'Copy', onClick: () => console.log('Copied') },
    {
      type: 'item',
      label: (
        <>
          <span>Paste</span>
          <kbd>Ctrl+V</kbd>
        </>
      ),
      onClick: () => console.log('Pasted')
    },
    { label: 'Open Documentation', href: 'https://dyvix-ui.vercel.app/' },
    { label: 'Redo (Unavailable)', disabled: true },
    { type: 'separator' },
    {
      type: 'group',
      items: [
        { label: 'Rename', onClick: () => console.log('Rename') },
        { label: 'Duplicate', onClick: () => console.log('Duplicate') }
      ]
    },
    { type: 'separator' },
    {
      type: 'group',
      separated: true,
      items: [
        { label: 'Archive', onClick: () => console.log('Archive') },
        { label: 'Export JSON', href: '#export-json' },
        { label: 'Delete', disabled: true, onClick: (e) => console.log('unfo') }
      ]
    }
  ];
  return (
    <div>
      <DyvixContextMenu items={menuItems} />

      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          width: '100%',
          color: 'rgba(255, 255, 255, 0.58)',
          fontSize: '2.4rem',
          userSelect: 'none'
        }}
      >
        Right-click anywhere
      </span>
    </div>
  );
}
