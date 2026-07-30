import { DyvixInput } from '../../../src';
import { DYVIX_GLOBAL_ANIMATION, DYVIX_GLOBAL_THEME } from '../../../src';
export function InputTest() {
  return (
    <>
      <DyvixInput
        animation={DYVIX_GLOBAL_ANIMATION.AURORA}
        theme={DYVIX_GLOBAL_THEME.SUNSET}
        type="text"
        placeholder={'Enter your name'}
      />
    </>
  );
}
