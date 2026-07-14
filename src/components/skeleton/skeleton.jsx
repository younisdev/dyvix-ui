import React from 'react';
import './dependencies/style/style.css';
import variantsData from './dependencies/variants.json';
import { EvaluateFailure, GuardStatus } from '../../utils/DyvixGuard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ValidateSkeleton } from './validation';
import Version from '../../../package.json';

export const validVariants = variantsData.map((e) => e.variant);

/**
 * @param {Object} props
 * @param {('text'|'text-lg'|'title'|'circle'|'circle-lg'|'rectangle'|'rectangle-lg'|'button'|'avatar'|'card')} [props.variant] - Skeleton shape variant
 * @param {('shimmer'|'pulse'|'wave')} [props.animationType] - Loading animation type (CSS-based)
 * @param {string} [props.animation] - GSAP animation name
 * @param {('Singularity'|'Industrial'|'Ember'|'Frost'|'Blade'|'Neon'|'Aurora'|'Sunset'|'Ocean'|'Forest'|'Midnight'|'Crimson'|'Obsidian'|'Coffee'|'Cosmos')} [props.theme] - Skeleton theme
 * @param {string} [props.className] - Additional className
 * @param {string} [props.width] - Custom width
 * @param {string} [props.height] - Custom height
 * @param {number} [props.count] - Number of skeleton lines to render (for text variant)
 * @param {Object} [props.style] - Inline style overrides
 */
function DyvixSkeleton({
  variant = 'text',
  animationType = 'shimmer',
  animation = '!/',
  theme = '!/',
  className = '',
  width,
  height,
  count = 1,
  style,
  ...rest
}) {
  const skeletonRef = React.useRef(null);
  const [configs, SetConfig] = React.useState({});
  const instanceId = React.useId();

  const currentTheme = configs['theme'];
  const currentAnimation = animation ? configs['animation'] : null;

  const currentVariant = variantsData.find(
    (e) => e.variant.trim().toLowerCase() === variant.trim().toLowerCase()
  );

  if (!currentVariant) {
    return EvaluateFailure(
      `Invalid skeleton variant: "${variant}". Valid variants: ${validVariants.join(', ')}`,
      GuardStatus.Error
    );
  }

  React.useEffect(() => {
    async function validate() {
      const validator = await ValidateSkeleton(
        animation,
        theme,
        SetConfig,
        instanceId
      );

      if (validator.status === GuardStatus.Error) {
        return EvaluateFailure(validator.error, validator.status);
      }
    }

    validate();
    return () => {
      const key = `DYVIX_${Version['version']}_Skeleton_theme_${instanceId}`;
      const ele = document.getElementById(key);
      if (ele) ele.remove();
    };
  }, [theme, animation]);

  useGSAP(() => {
    if (!skeletonRef.current || !currentAnimation) return;

    gsap.fromTo(skeletonRef.current, currentAnimation.from, {
      ...currentAnimation.to,
      duration: currentAnimation['default-duration'],
      ease: currentAnimation.ease
    });
  }, [currentAnimation]);

  const animTypeClass =
    animationType === 'shimmer'
      ? 'dyvix-skeleton--shimmer'
      : animationType === 'pulse'
        ? 'dyvix-skeleton--pulse'
        : animationType === 'wave'
          ? 'dyvix-skeleton--wave'
          : 'dyvix-skeleton--shimmer';

  const buildClassName = () => {
    return [
      'dyvix-skeleton',
      currentVariant.class,
      animTypeClass,
      currentTheme?.class || '',
      className
    ]
      .filter(Boolean)
      .join(' ');
  };

  const customStyle = {
    ...(width && { width }),
    ...(height && { height }),
    ...style
  };

  // Render multiple lines for text variants with count > 1
  if (count > 1 && (variant === 'text' || variant === 'text-lg')) {
    return (
      <div
        className="dyvix-skeleton-group"
        ref={skeletonRef}
        {...rest}
      >
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className={i === count - 1 ? buildClassName() + ' dyvix-skeleton--w75' : buildClassName()}
            style={i === count - 1 ? { ...customStyle, width: '75%' } : customStyle}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={buildClassName()}
      ref={skeletonRef}
      style={customStyle}
      {...rest}
    />
  );
}

/**
 * Pre-built skeleton layout: Avatar + text lines
 */
export function DyvixSkeletonAvatarText({
  theme = '!/',
  animationType = 'shimmer',
  lines = 3,
  className = '',
  style
}) {
  return (
    <div className={`dyvix-skeleton-group--row ${className}`} style={style}>
      <DyvixSkeleton variant="circle" animationType={animationType} theme={theme} />
      <div className="dyvix-skeleton-group" style={{ flex: 1 }}>
        <DyvixSkeleton variant="text" animationType={animationType} theme={theme} count={lines} />
      </div>
    </div>
  );
}

/**
 * Pre-built skeleton layout: Card with image + text
 */
export function DyvixSkeletonCard({
  theme = '!/',
  animationType = 'shimmer',
  lines = 3,
  className = '',
  style
}) {
  return (
    <div className={`dyvix-skeleton-group--card ${className}`} style={style}>
      <DyvixSkeleton variant="rectangle" animationType={animationType} theme={theme} />
      <DyvixSkeleton variant="title" animationType={animationType} theme={theme} />
      <DyvixSkeleton variant="text" animationType={animationType} theme={theme} count={lines} />
      <DyvixSkeleton variant="button" animationType={animationType} theme={theme} />
    </div>
  );
}

export default DyvixSkeleton;
