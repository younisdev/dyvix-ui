import { DyvixFile } from 'dyvix-ui';
import Wrapper from '../Wrapper';
import React from 'react';
import { DYVIX_GLOBAL_THEME, DYVIX_GLOBAL_ANIMATION } from 'dyvix-ui';

export default function FilePlayground() {
  const [config, setConfig] = React.useState([
    {
      utility: 'label',
      type: 'text',
      current: 'Upload File',
      format: 'string'
    },
    {
      utility: 'animation',
      type: 'select',
      options: DYVIX_GLOBAL_ANIMATION,
      current: DYVIX_GLOBAL_ANIMATION.AURORA,
      format: 'string',
      allowNull: true
    },
    {
      utility: 'theme',
      type: 'select',
      options: DYVIX_GLOBAL_THEME,
      current: DYVIX_GLOBAL_THEME.MIDNIGHT,
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
      utility: 'multiple',
      type: 'select',
      options: {
        TRUE: true,
        FALSE: ''
      },
      current: true,
      format: 'boolean'
    },
    {
      utility: 'accept',
      type: 'text',
      current: '.jpg, .jpeg, .png',
      format: 'string'
    }
  ]);

  const label = config.find((e) => e.utility === 'label').current;
  const animation = config.find((e) => e.utility === 'animation').current;
  const theme = config.find((e) => e.utility === 'theme').current;
  const background = config.find((e) => e.utility === 'background').current;
  const color = config.find((e) => e.utility === 'color').current;
  const multiple = config.find((e) => e.utility === 'multiple').current;
  const accept = config.find((e) => e.utility === 'accept').current;

  const props = {
    ...(label && { label: label }),
    ...(animation && { animation: animation }),
    ...(theme && { theme: theme }),
    ...(background && { background: background }),
    ...(color && { color: color }),
    ...(multiple && { multiple: multiple }),
    ...(accept && { accept: accept })
  };
  return (
    <Wrapper
      componentConfig={config}
      componentCallback={setConfig}
      tag={'DyvixFile'}
    >
      <DyvixFile onUpload={(data) => console.log(data)} {...props} />
    </Wrapper>
  );
}
