import { DyvixFile } from '../../../src';

export function FileTest() {
  return (
    <>
      <DyvixFile
        onUpload={(data) => console.log(data)}
        multiple={true}
        overrides={{
          '--dyvix-file-bg': 'rgba(0, 255, 102, 0.05)',
          '--dyvix-file-color': '#00ff66',
          '--dyvix-file-border-color': 'rgba(0, 255, 102, 0.35)',
          '--dyvix-file-border-radius': '8px',
          '--dyvix-file-hover-bg': 'rgba(0, 255, 102, 0.12)',
          '--dyvix-file-hover-border-color': '#00ff66'
        }}
      />
    </>
  );
}
