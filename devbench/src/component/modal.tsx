import {
  Modal,
  DYVIX_MODAL_ELEMENT
} from '../../../src';

export function ModalTest() {
  const types = Object.values(DYVIX_MODAL_ELEMENT);
  const optionatedTypes = ['select', 'd-select', 'autocomplete'];

  const simpleHeightTestData = Array.from({ length: 9 }, (_, i) => ({
    type: 'text',
    name: `field_${i}`,
    placeholder: `Extended Field ${i + 1}`,
    amount: 1
  }));
  const stressTestData = Array.from({ length: 7 }, (_, i) => {
    const randomEleType = types[Math.floor(Math.random() * types.length)];
    let props = { type: randomEleType, amount: (i % 3) + 1 };
    let placeholder = [];
    let name = [];
    let options = [];

    for (let j = 0; j < props.amount; j++) {
      placeholder.push(`Test Field ${i + 1}_${j + 1}`);
      name.push(`dynamic_field_${i + 1}_${j + 1}`);
      options.push([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    }
    props = {
      ...props,
      ...{
        placeholder: placeholder,
        name: name,
        ...(options.length > 0 && { options: options })
      }
    };

    return props;
  });

  return (
    <Modal
      title="Register"
      Id="register-modal"
      className="testmodal"
      style={{
        position: 'absolute',
        top: 0,
        left: 5,
        width: '500px'
      }}
      dynamicPositioning={false}
      type="form"
      animation={'fade'}
      elements={[
        {
          type: 'text',
          name: 'fullName',
          placeholder: 'Full Name',
          amount: 1
        },
        {
          type: 'radio',
          name: 'plan',
          placeholder: 'Choose a plan',
          options: ['Free', 'Pro', 'Enterprise'],
          amount: 1
        }
      ]}
      onSubmit={(data) => console.log(data)}
      onChange={(data) => console.log(data)}
    />
  );
}
