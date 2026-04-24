import { DynamicSelect } from 'dyvix-ui';

export function SelectTest() {
  return (
    <DynamicSelect
      className="ex-select"
      type="select"
      elements={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
      onChange={(data) => console.log(data)}
    />
  );
}
