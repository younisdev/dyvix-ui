import { DyvixContextMenu, DyvixContextMenuItem } from '../../../src';

export function CommandMenuTest() {
  return (
    <div>
      <DyvixContextMenu animation={'flip'}>
        <DyvixContextMenuItem onClick={() => console.log('refresh')}>
          Refresh
        </DyvixContextMenuItem>
        <DyvixContextMenuItem onClick={() => console.log('delete')}>
          Delete
        </DyvixContextMenuItem>
        <DyvixContextMenuItem onClick={() => console.log('delete')}>
          Delete
        </DyvixContextMenuItem>
      </DyvixContextMenu>

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
