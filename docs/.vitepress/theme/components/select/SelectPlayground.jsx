import { DyvixSelect } from 'dyvix-ui';
import Wrapper from '../Wrapper';
import React from 'react';
import { DYVIX_GLOBAL_ANIMATION, DYVIX_GLOBAL_THEME } from 'dyvix-ui';

export default function SelectPlayground() {
  const [config, setConfig] = React.useState([
    {
      utility: 'type',
      type: 'select',
      options: {
        SELECT: 'select',
        AUTOCOMPLETE: 'autocomplete'
      },
      current: 'select',
      format: 'string'
    },
    {
      utility: 'theme',
      type: 'select',
      options: DYVIX_GLOBAL_THEME,
      current: DYVIX_GLOBAL_THEME.SINGULARITY,
      format: 'string',
      allowNull: true
    },
    {
      utility: 'animation',
      type: 'select',
      options: DYVIX_GLOBAL_ANIMATION,
      current: DYVIX_GLOBAL_ANIMATION.FADE,
      format: 'string',
      allowNull: true
    },
    {
      utility: 'background',
      type: 'color',
      current: undefined,
      format: 'string'
    },
    {
      utility: 'dropdownBackground',
      type: 'color',
      current: undefined,
      format: 'string'
    },
    {
      utility: 'placeholder',
      type: 'text',
      current: 'Select an option',
      format: 'string'
    }
  ]);

  const type = config.find((e) => e.utility === 'type').current;
  const theme = config.find((e) => e.utility === 'theme').current;
  const animation = config.find((e) => e.utility === 'animation').current;
  const background = config.find((e) => e.utility === 'background')?.current;
  const dropdownBackground = config.find(
    (e) => e.utility === 'dropdownBackground'
  )?.current;
  const placeholder = config.find((e) => e.utility === 'placeholder').current;
  const props = {
    ...(type && { type }),
    ...(theme && { theme }),
    ...(animation && { animation }),
    ...(background && { background }),
    ...(dropdownBackground && { dropdownBackground }),
    ...(placeholder && { placeholder })
  };

  return (
    <Wrapper
      componentConfig={config}
      componentCallback={setConfig}
      tag={'DyvixSelect'}
    >
      <DyvixSelect
        className="ex-select"
        type="select"
        elements={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
        onChange={(data) => console.log(data)}
        {...props}
      />
    </Wrapper>
  );
}
