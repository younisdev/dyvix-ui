import React from 'react';
import './dependencies/style/style.css';
import themes from './dependencies/themes.json';

/**
 * DyvixSkeleton - A skeleton loading component with shimmer animation and theme support.
 *
 * @param {Object} props
 * @param {'text'|'circle'|'rectangle'|'heading'|'button'} [props.shape='text'] - Skeleton shape
 * @param {number} [props.width] - Custom width (px or CSS value)
 * @param {number} [props.height] - Custom height (px or CSS value)
 * @param {boolean} [props.shimmer=true] - Enable shimmer animation
 * @param {boolean} [props.pulse=false] - Use pulse animation instead of shimmer
 * @param {string} [props.theme='Default'] - Theme name
 * @param {number} [props.lines] - Number of text lines to render (only for text shape)
 * @param {number} [props.gap] - Gap between lines in px (only when lines > 1)
 * @param {string} [props.className] - Additional CSS class
 */
export function DyvixSkeleton({
  shape = 'text',
  width,
  height,
  shimmer = true,
  pulse = false,
  theme = 'Default',
  lines,
  gap = 8,
  className = '',
  ...rest
}) {
  const themeEntry = themes.find(
    (t) => t.theme.trim().toLowerCase() === theme.trim().toLowerCase()
  );
  const themeClass = themeEntry ? themeEntry.class : 'dyvix-skeleton-theme-default';

  const shapeClass = `dyvix-skeleton-${shape}`;

  const animationClasses = [];
  if (shimmer && !pulse) animationClasses.push('dyvix-skeleton-shimmer');
  if (pulse) animationClasses.push('dyvix-skeleton-pulse');

  const baseClasses = [
    'dyvix-skeleton',
    shapeClass,
    themeClass,
    ...animationClasses,
    className,
  ].join(' ');

  const style = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  // Multi-line support for text shape
  if (shape === 'text' && lines && lines > 1) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={baseClasses}
            style={{
              ...style,
              width: i === lines - 1 ? '70%' : style.width || '100%',
            }}
            {...rest}
          />
        ))}
      </div>
    );
  }

  return <div className={baseClasses} style={style} {...rest} />;
}

export default DyvixSkeleton;
