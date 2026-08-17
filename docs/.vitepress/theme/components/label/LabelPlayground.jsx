import { DyvixLabel } from 'dyvix-ui';
import Wrapper from '../Wrapper';
import React from 'react';
import { DYVIX_GLOBAL_THEME, DYVIX_GLOBAL_ANIMATION } from 'dyvix-ui';

export default function LabelPlayground() {
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
      current: DYVIX_GLOBAL_ANIMATION.FADE,
      format: 'string',
      allowNull: true
    },
    {
      utility: 'children',
      type: 'text',
      current: 'Label Text',
      format: 'string'
    }
  ]);

  const theme = config.find((e) => e['utility'] === 'theme').current;
  const animation = config.find((e) => e['utility'] === 'animation').current;
  const children = config.find((e) => e['utility'] === 'children').current;
  const probs = {
    ...(theme && { theme: theme }),
    ...(animation && { animation: animation })
  };
  return (
    <Wrapper
      componentConfig={config}
      componentCallback={setConfig}
      tag={'DyvixLabel'}
    >
      <DyvixLabel htmlFor="demo-input" {...probs}>
        {children}
      </DyvixLabel>
    </Wrapper>
  );
}
