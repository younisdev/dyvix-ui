import { DyvixFile } from 'dyvix-ui';
import { DYVIX_GLOBAL_ANIMATION, DYVIX_GLOBAL_THEME } from 'dyvix-ui';
export function FileTest() {
  return (
    <>
      <DyvixFile
        onUpload={(data) => console.log(data)}
        multiple={true}
        theme={DYVIX_GLOBAL_THEME.MIDNIGHT}
        animation={DYVIX_GLOBAL_ANIMATION.AURORA}
        accept={'.jpg, .jpeg, .png'}
      />
    </>
  );
}
