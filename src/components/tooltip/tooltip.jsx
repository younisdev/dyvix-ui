import React from 'react';
import './dependencies/style/style.css';
import './dependencies/style/themes.css';
import themes from './dependencies/themes.json';

/**
 * DyvixTooltip - A tooltip component with theme support and configurable placement.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The trigger element
 * @param {string} props.content - Tooltip text content
 * @param {'top'|'bottom'|'left'|'right'} [props.placement='top'] - Tooltip placement
 * @param {string} [props.theme='Default'] - Theme name
 * @param {number} [props.delay=0] - Show delay in milliseconds
 * @param {number} [props.hideDelay=0] - Hide delay in milliseconds
 * @param {string} [props.className] - Additional CSS class
 */
export function DyvixTooltip({
  children,
  content,
  placement = 'top',
  theme = 'Default',
  delay = 0,
  hideDelay = 0,
  className = '',
}) {
  const [visible, setVisible] = React.useState(false);
  const showTimerRef = React.useRef(null);
  const hideTimerRef = React.useRef(null);

  const themeEntry = themes.find(
    (t) => t.theme.trim().toLowerCase() === theme.trim().toLowerCase()
  );
  const themeClass = themeEntry ? themeEntry.class : 'dyvix-tooltip-theme-default';

  const handleMouseEnter = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (delay > 0) {
      showTimerRef.current = setTimeout(() => setVisible(true), delay);
    } else {
      setVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (showTimerRef.current) clearTimeout(showTimerRef.current);
    if (hideDelay > 0) {
      hideTimerRef.current = setTimeout(() => setVisible(false), hideDelay);
    } else {
      setVisible(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const tooltipClasses = [
    'dyvix-tooltip',
    `dyvix-tooltip-${placement}`,
    themeClass,
    visible ? 'dyvix-tooltip-visible' : '',
    className,
  ].join(' ');

  return (
    <div
      className="dyvix-tooltip-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <div className={tooltipClasses} role="tooltip">
        {content}
      </div>
    </div>
  );
}

export default DyvixTooltip;
