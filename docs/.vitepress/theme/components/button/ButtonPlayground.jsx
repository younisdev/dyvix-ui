import { DyvixButton } from 'dyvix-ui';
import { DYVIX_GLOBAL_THEME } from 'dyvix-ui';
import Wrapper from '../Wrapper';
import React from 'react';

export default function ButtonPlayground() {

  const [theme, setTheme] = React.useState('Aurora')
  const [config, setConfig] = React.useState({
    
  });


  return (
    <Wrapper compConfig={config}>
      <DyvixButton onClick={() => console.log('clicked')} theme={theme}>Submit</DyvixButton>
    </Wrapper>
  );
}
