import { DyvixFile } from 'dyvix-ui';
import { DYVIX_MODAL_THEME } from 'dyvix-ui';
export function FileTest() {
  return (
    <>
      <DyvixFile
        onClick={() => console.log('clicked')}
        animation={'bubble'}
        theme={DYVIX_MODAL_THEME.MIDNIGHT}
      >
        Submit
      </DyvixFile>
    </>
  );
}
