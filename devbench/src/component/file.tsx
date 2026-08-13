import { DyvixFile } from '../../../src';

export function FileTest() {
  return (
    <>
      <DyvixFile
        onUpload={(data) => console.log(data)}
        multiple={true}
        //accept={'.jpg, .jpeg, .png'}
        theme={'Forest'}
        animation={'bounce'}
      />
    </>
  );
}
