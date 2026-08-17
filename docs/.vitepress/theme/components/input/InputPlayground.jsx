import { DyvixInput } from 'dyvix-ui';
import Wrapper from '../Wrapper';
import React from 'react';
import { DYVIX_GLOBAL_ANIMATION, DYVIX_GLOBAL_THEME } from 'dyvix-ui';

export default function InputPlayground() {
  const [config, setConfig] = React.useState([
    {
      utility: 'type',
      type: 'select',
      options: {
        TEXT: 'text',
        EMAIL: 'email',
        PASSWORD: 'password',
        NUMBER: 'number',
        SEARCH: 'search',
        TEL: 'tel',
        URL: 'url'
      },
      current: 'text',
      format: 'string'
    },
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
      current: DYVIX_GLOBAL_ANIMATION.AURORA,
      format: 'string',
      allowNull: true
    },
    {
      utility: 'placeholder',
      type: 'text',
      current: 'Enter your name',
      format: 'string'
    },
    {
      utility: 'name',
      type: 'text',
      current: 'fullName',
      format: 'string'
    },
    {
      utility: 'id',
      type: 'text',
      current: 'dyvix-input-demo',
      format: 'string'
    },
    {
      utility: 'aria-label',
      type: 'text',
      current: 'Demo input',
      format: 'string'
    },
    {
      utility: 'autoComplete',
      type: 'text',
      current: 'name',
      format: 'string'
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
    }
  ]);

  const type = config.find((e) => e.utility === 'type').current;
  const theme = config.find((e) => e.utility === 'theme').current;
  const animation = config.find((e) => e.utility === 'animation').current;
  const placeholder = config.find((e) => e.utility === 'placeholder').current;
  const name = config.find((e) => e.utility === 'name').current;
  const id = config.find((e) => e.utility === 'id').current;
  const ariaLabel = config.find((e) => e.utility === 'aria-label').current;
  const autoComplete = config.find((e) => e.utility === 'autoComplete').current;
  const background = config.find((e) => e.utility === 'background').current;
  const color = config.find((e) => e.utility === 'color').current;

  const props = {
    ...(type && { type }),
    ...(theme && { theme }),
    ...(animation && { animation }),
    ...(placeholder && { placeholder }),
    ...(name && { name }),
    ...(id && { id }),
    ...(ariaLabel && { 'aria-label': ariaLabel }),
    ...(autoComplete && { autoComplete }),
    ...(background && { background }),
    ...(color && { color })
  };

  return (
    <Wrapper
      componentConfig={config}
      componentCallback={setConfig}
      tag={'DyvixInput'}
    >
      <DyvixInput
        {...props}
        onChange={(event) => console.log(event.target.value)}
      />
    </Wrapper>
  );
}
