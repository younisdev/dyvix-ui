import {
  DyvixToastContainer,
  dyvixToast,
  DYVIX_GLOBAL_ANIMATION
} from 'dyvix-ui';
import Wrapper from '../Wrapper';
import React from 'react';

const TOAST_POSITIONS = {
  TOP_LEFT: 'top-left',
  TOP_RIGHT: 'top-right',
  TOP_CENTER: 'top-center',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM_CENTER: 'bottom-center'
};

const TOAST_DURATIONS = {
  SHORT: 2000,
  DEFAULT: 5000,
  LONG: 8000
};

const TOAST_SEGMENTS = {
  ONE: 1,
  THREE: 3,
  FIVE: 5,
  TEN: 10
};

export default function ToastPlayground() {
  const [config, setConfig] = React.useState([
    {
      utility: 'position',
      type: 'select',
      options: TOAST_POSITIONS,
      current: TOAST_POSITIONS.TOP_RIGHT,
      format: 'string',
      allowNull: false
    },
    {
      utility: 'duration',
      type: 'select',
      options: TOAST_DURATIONS,
      current: TOAST_DURATIONS.DEFAULT,
      format: 'number',
      allowNull: false
    },
    {
      utility: 'animation',
      type: 'select',
      options: DYVIX_GLOBAL_ANIMATION,
      current: DYVIX_GLOBAL_ANIMATION.ZOOM,
      format: 'string',
      allowNull: false
    },
    {
      utility: 'segments',
      type: 'select',
      options: TOAST_SEGMENTS,
      current: TOAST_SEGMENTS.THREE,
      format: 'number',
      allowNull: false
    }
  ]);

  const position = config.find((e) => e.utility === 'position').current;
  const duration = Number(config.find((e) => e.utility === 'duration').current);
  const animation = config.find((e) => e.utility === 'animation').current;
  const segments = Number(config.find((e) => e.utility === 'segments').current);

  return (
    <Wrapper
      componentConfig={config}
      componentCallback={setConfig}
      tag={'DyvixToastContainer'}
    >
      <div>
        <DyvixToastContainer
          position={position}
          duration={duration}
          animation={animation}
          segments={segments}
        />
        <div style={{display: 'flex', gap: '5px', flexWrap: 'wrap', padding: '16px 0'}}>
          <button className={'toast-btn'} style={{ backgroundColor: '#22c55e'}} onClick={() => dyvixToast.success('Operation completed')}>
            Success toast
          </button>
          <button className={'toast-btn'} style={{ backgroundColor: '#ef4444'}} onClick={() => dyvixToast.error('Something went wrong')}>
            Error toast
          </button>
          <button className={'toast-btn'} style={{ backgroundColor: '#eab308'}} onClick={() => dyvixToast.warning('Please review this action')}>
            Warning toast
          </button>
          <button className={'toast-btn'} style={{ backgroundColor: '#3b82f6'}} onClick={() => dyvixToast.info('Here is an update')}>
            Info toast
          </button>
        </div>
      </div>
    </Wrapper>
  );
}
