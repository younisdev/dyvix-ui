import React from 'react';
import './dependencies/style/style.css';
import { EvaluateFailure, GuardStatus } from '../../utils/DyvixGuard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ConstructClasses, SmartPropsSplitting } from '../../utils/utils';
import type { DyvixContextMenuProps } from './dependencies/context-menu.types';

const DyvixContextMenu = React.forwardRef<
  HTMLDivElement,
  DyvixContextMenuProps
>(({ children }, ref) => {
  const internalRef = React.useRef<HTMLDivElement | null>(null);
  React.useImperativeHandle(ref, () => internalRef.current as HTMLDivElement);

  const controllerRef = React.useRef<HTMLDivElement | null>(null);
  const [rawCord, setRawCords] = React.useState({ x: 0, y: 0 });
  const [computedCord, setComputedCords] = React.useState({ x: 0, y: 0 });
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const parent = controllerRef.current?.parentElement;

    if (!parent) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setRawCords({ x: e.clientX, y: e.clientY });
      setOpen(true);
    };

    parent.addEventListener('contextmenu', handleContextMenu);

    return () => {
      parent.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  React.useLayoutEffect(() => {
    if (!open || !controllerRef.current) return;

    const rect = controllerRef.current.getBoundingClientRect();
    const padding = 10;

    let nextX = rawCord.x;
    let nextY = rawCord.y;

    if (rawCord.x + rect.width + padding > window.innerWidth) {
      nextX = Math.max(padding, rawCord.x - rect.width);
    }

    if (rawCord.y + rect.height + padding > window.innerHeight) {
      nextY = Math.max(padding, rawCord.y - rect.height);
    }

    setComputedCords({ x: nextX, y: nextY });
  }, [rawCord, open]);

  React.useEffect(() => {
    const handleMouseClick = (e: MouseEvent) => {
      if (e.button !== 0) return;
      setOpen(false);
    };
    const handleExitClick = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      setOpen(false);
    };

    document.addEventListener('mousedown', handleMouseClick);
    document.addEventListener('keydown', handleExitClick);
    return () => {
      document.removeEventListener('mousedown', handleMouseClick);
      document.removeEventListener('keydown', handleExitClick);
    };
  }, [open]);

  const compinedWrapperStyles = {
    position: 'fixed',
    top: computedCord.y,
    left: computedCord.x,
    zIndex: 9999
  } as React.CSSProperties;

  return (
    <>
      <span aria-hidden style={{ display: 'none' }} ref={controllerRef} />
      {open && (
        <div
          className="dyvix-context-menu-wrapper"
          ref={internalRef}
          style={compinedWrapperStyles}
        >
          <div className="dyvix-context-menu dyvix-context-menu-default">
            {children}
          </div>
        </div>
      )}
    </>
  );
});

export default DyvixContextMenu;
