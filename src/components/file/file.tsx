import React from 'react';
import './dependencies/style/style.css';
import { EvaluateFailure, GuardStatus } from '../../utils/DyvixGuard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Version from '../../../package.json';
import { Validatefile } from './validation';
import type { DyvixFileProps } from './dependencies/file.types';
import { ConstructClasses, SmartPropsSplitting } from '../../utils/utils';

const DyvixFile = React.forwardRef<HTMLDivElement, DyvixFileProps>(
  (
    {
      label = 'Upload File',
      animation,
      className,
      theme,
      background,
      color,
      multiple = false,
      accept = '*/*',
      onUpload,
      style,
      timeline,
      ...rest
    },
    ref
  ) => {
    const [file, Setfile] = React.useState<string | null>(null);
    const internalRef = React.useRef<HTMLDivElement>(null);
    const addedToTimeLineRef = React.useRef<{
      theme: string | null;
      animation: string | null;
    } | null>(null);
    React.useImperativeHandle(ref, () => internalRef.current as HTMLDivElement);

    const [configs, SetConfig] = React.useState({});
    const { wrapperProps, elementProps } = SmartPropsSplitting({
      style,
      ...rest
    });
    const instanceId = React.useId();

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
      const files = e.target.files;
      let displayName: string = '';
      const maxLength = 16;

      if (files && files[0]) {
        if (files.length === 1) {
          const fullName = files[0].name;
          const lastDotIndex = fullName.lastIndexOf('.');
          if (lastDotIndex <= 0) {
            displayName =
              fullName.length > maxLength
                ? `${fullName.substring(0, maxLength - 3)}...`
                : fullName;
          } else {
            const name = fullName.substring(0, lastDotIndex);
            const extension = fullName.substring(lastDotIndex + 1);

            const wordLimit = maxLength - (extension.length + 1);
            if (wordLimit > 3 && name.length > wordLimit) {
              displayName = `${name.substring(0, wordLimit - 3)}...${extension}`;
            } else if (name.length > wordLimit) {
              displayName = `${fullName.substring(0, maxLength - 3)}...`;
            } else {
              displayName = `${name}.${extension}`;
            }
          }
        } else {
          displayName = files.length + ' files selected.';
        }

        Setfile(displayName);

        if (typeof onUpload === 'function') {
          onUpload(files.length === 1 ? files[0] : files);
        }
      }
    }

    const currentTheme = (configs as any)['theme'];
    const currentAnimation = animation ? (configs as any)['animation'] : null;
    React.useEffect(() => {
      async function validate() {
        const validator = await Validatefile(
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
        const key = `DYVIX_${Version['version']}_File_theme_${instanceId}`;
        const ele = document.getElementById(key);
        if (ele) ele.remove();
      };
    }, [animation, theme]);

    useGSAP(
      () => {
        if (!internalRef.current || !currentAnimation) return;

        const toVars: GSAPTweenVars = {
          ...currentAnimation.to,
          duration: currentAnimation['default-duration'],
          ease: currentAnimation.ease
        };

        if (timeline) {
          if (
            addedToTimeLineRef.current?.theme === theme &&
            addedToTimeLineRef.current?.animation === animation
          )
            return;

          timeline.fromTo(internalRef.current, currentAnimation.from, toVars);
          addedToTimeLineRef.current = {
            theme: theme || null,
            animation: animation || null
          };
        } else {
          gsap.fromTo(internalRef.current, currentAnimation.from, toVars);
        }
      },
      { scope: internalRef, dependencies: [currentAnimation, currentTheme] }
    );
    const { style: splitElementStyles, ...restElementProps } = elementProps;

    const props = {
      className: ConstructClasses('dyvix-file', currentTheme?.class, className),
      style: {
        ...(background && { background: background }),
        ...splitElementStyles
      },
      ...restElementProps
    };
    return (
      <div className="dyvix-file-wrapper" ref={internalRef} {...wrapperProps}>
        <label {...props} htmlFor={`file-upload-${instanceId}`}>
          <div className="dyvix-file-ui">
            <span className="dyvix-file-icon">📁</span>
            <p style={{ color: color }}>{file !== null ? file : label}</p>
          </div>
          <input
            type="file"
            className="dyvix-file-hidden"
            id={`file-upload-${instanceId}`}
            accept={accept}
            onChange={(e) => handleFileChange(e)}
            {...(multiple && { multiple })}
          />
        </label>
      </div>
    );
  }
);

export default DyvixFile;
