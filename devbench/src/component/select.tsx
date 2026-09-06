import { DyvixSelect } from '../../../src';

export function SelectTest() {
  return (
    <DyvixSelect
      animation={'glitch'}
      theme={'Frost'}
      placeholder="number"
      className="ex-select"
      type="select"
      elements={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
      onChange={(data) => console.log(data)}
    />
  );
}
