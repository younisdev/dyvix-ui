import { DyvixButton } from 'dyvix-ui';
import Wrapper from '../Wrapper';
import React from 'react';
import { DYVIX_GLOBAL_THEME, DYVIX_GLOBAL_ANIMATION } from 'dyvix-ui';

export default function ButtonPlayground() {
  const [config, setConfig] = React.useState([
    {
      utility: 'theme',
      type: 'select',
      options: DYVIX_GLOBAL_THEME,
      current: DYVIX_GLOBAL_THEME.OCEAN,
      format: 'string',
      allowNull: true
    },
    {
      utility: 'animation',
      type: 'select',
      options: DYVIX_GLOBAL_ANIMATION,
      current: DYVIX_GLOBAL_ANIMATION.BUBBLE,
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
      utility: 'color',
      type: 'color',
      current: undefined,
      format: 'string'
    },
    {
      utility: 'children',
      type: 'text',
      current: 'Submit',
      format: 'string'
    }
  ]);

  const theme = config.find((e) => e['utility'] === 'theme').current;
  const animation = config.find((e) => e['utility'] === 'animation').current;
  const background = config.find((e) => e['utility'] === 'background').current;
  const color = config.find((e) => e['utility'] === 'color').current;
  const children = config.find((e) => e['utility'] === 'children').current;
  const probs = {
    ...(theme && { theme: theme }),
    ...(animation && { animation: animation }),
    ...(background && { background: background }),
    ...(color && { color: color })
  };
  return (
    <Wrapper
      componentConfig={config}
      componentCallback={setConfig}
      tag={'DyvixButton'}
    >
      <DyvixButton onClick={() => console.log('clicked')} {...probs}>
        {children}
      </DyvixButton>
    </Wrapper>
  );
}
