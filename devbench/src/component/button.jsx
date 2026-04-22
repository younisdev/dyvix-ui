import { DyvixButton } from 'dyvix-ui';
import { DYVIX_MODAL_THEME } from 'dyvix-ui';
export function ButtonTest() {
  return (
    <>

      <DyvixButton onClick={() => console.log('clicked')} animation={'bubble'} theme={DYVIX_MODAL_THEME.FROST}>
      Submit
    </DyvixButton>
    </>
  );
}
