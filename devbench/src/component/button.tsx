import React from 'react';
import { DyvixButton, DYVIX_GLOBAL_THEME } from '../../../src';
import type { DyvixButtonThemes } from '../../../src/components/button/dependencies/button.types';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function ButtonTest() {
  const [theme, setTheme] = React.useState(DYVIX_GLOBAL_THEME.SINGULARITY);

  const themeOptions = React.useMemo(
    () => Object.values(DYVIX_GLOBAL_THEME),
    []
  );
  const refx = React.useRef(null);

  useGSAP(() => {
  //  if(!refx.current) return;
   return
    gsap.to(refx.current, {opacity: 0, scale: 1.5, delay: 1});

    console.log(refx.current)
  }, [])


  return (
    <>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <label htmlFor="dyvix-button-theme">Theme</label>
        <select
          id="dyvix-button-theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          {themeOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 16 }}>
        <DyvixButton
          theme={theme as DyvixButtonThemes}
          animation={"bubble"}
          ref={refx}
          onClick={() => console.log('clicked')}
        >
          Submit
        </DyvixButton>
      </div>
    </>
  );
}
