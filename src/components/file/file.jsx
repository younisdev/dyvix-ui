import React from 'react';
import './dependencies/style/style.css';
import { EvaluateFailure, GaurdStatus } from '../../utils/DyvixGuard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Version from '../../../package.json';
import { Validatefile } from './validation';

function DyvixFile({
  label = 'Upload File',
  animation = '',
  className = '',
  theme = '',
  background,
  color,
  multiple = false,
  accept = '*/*',
  onUpload,
  style,
  ...rest
}) {
  const [file, Setfile] = React.useState(null);
  const fileRef = React.useRef(null);
  const [configs, SetConfig] = React.useState({});
  const instanceId = React.useId();

  function handleFileChange(e) {
    const files = e.target.files;
    if (files && files[0]) {
      let displayName;
      if (files.length === 1) {
        const [name, extension] = files[0].name.split('.');

        const maxLength = 16;
        const wordLimit = maxLength - (extension.length + 1);
        if (name.length > wordLimit) {
          displayName =
            name.substring(0, wordLimit - 3) + '...' + '.' + extension;
        } else {
          displayName = name + '.' + extension;
        }
      } else {
        displayName = files.length + ' files selected.';
      }

      Setfile(displayName);

      if (typeof onUpload === 'function') {
        onUpload(files.length == 1 ? files[0] : files);
      }
    }
  }

  const currentTheme = configs['theme'];
  const currentAnimation = animation ? configs['animation'] : null;
  React.useEffect(() => {
    async function validate() {
      const validator = await Validatefile(
        animation,
        theme,
        SetConfig,
        instanceId
      );

      if (validator.status === GaurdStatus.Error) {
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

  useGSAP(() => {
    if (!fileRef.current || !currentAnimation) return;

    gsap.fromTo(fileRef.current, currentAnimation.from, {
      ...currentAnimation.to,
      duration: currentAnimation['default-duration'],
      ease: currentAnimation.ease
    });
  }, [currentAnimation]);
  className = `dyvix-file${currentTheme ? ` ${currentTheme.class}` : ''}${className !== '' ? ` ${className}` : ''}`;
  const props = {
    className: className,
    style: {
      ...(background && { background: background }),
      ...style
    }
  };
  return (
    <div className="dyvix-file-wrapper" ref={fileRef} {...rest}>
      <label {...props} htmlFor="file-upload">
        <div className="dyvix-file-ui">
          <span className="dyvix-file-icon">📁</span>
          <p style={{ color: color }}>{file !== null ? file : label}</p>
        </div>
        <input
          type="file"
          className="dyvix-file-hidden"
          id="file-upload"
          accept={accept}
          onChange={(e) => handleFileChange(e)}
          {...(multiple && { multiple })}
        />
      </label>
    </div>
  );
}

export default DyvixFile;
