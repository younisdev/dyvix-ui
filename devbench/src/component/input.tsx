import { DyvixInput } from '../../../src';
import { DYVIX_GLOBAL_ANIMATION, DYVIX_GLOBAL_THEME } from '../../../src';
export function InputTest() {
  return (
    <>
      <DyvixInput
        animation={'aurora'}
        theme={'Coffee'}
        type="text"
        placeholder={'Enter your name'}
      />
    </>
  );
}
