import {
  Modal,
  DYVIX_GLOBAL_ANIMATION,
  DYVIX_GLOBAL_THEME,
  DYVIX_MODAL_ELEMENT
} from 'dyvix-ui';
import React from 'react';
export function ModalTest() {
  const types = Object.values(DYVIX_MODAL_ELEMENT);
  const optionatedTypes = ['select', 'd-select', 'autocomplete'];

  const simpleHeightTestData = Array.from({ length: 1 }, (_, i) => ({
    type: 'text',
    name: `field_${i}`,
    placeholder: `Extended Field ${i + 1}`,
    amount: 1
  }));
  const stressTestData = Array.from({ length: 5 }, (_, i) => {
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

  // Multi-step modal example: a two-page registration flow. Toggle `useSteps`
  // to compare against the classic single-view `elements` modal above.
  const useSteps = true;
  const registrationSteps = [
    {
      title: 'Account Details',
      elements: [
        {
          type: 'text',
          name: 'firstName',
          placeholder: 'First Name',
          amount: 1
        },
        {
          type: 'email',
          name: 'email',
          placeholder: 'Email',
          amount: 1,
          validation: 'email'
        }
      ]
    },
    {
      title: 'Security',
      elements: [
        {
          type: 'password',
          name: 'password',
          placeholder: 'Password',
          id: 'password',
          amount: 1
        },
        {
          type: 'password',
          name: 'confirmPassword',
          placeholder: 'Confirm Password',
          match: 'password',
          amount: 1
        }
      ]
    }
  ];

  if (useSteps) {
    return (
      <Modal
        title="Register"
        Id="register-modal"
        className="testmodal"
        theme={'Crimson'}
        type="form"
        steps={registrationSteps}
        onSubmit={(data) => console.log('submitted', data)}
        onChange={(data) => console.log(data)}
      />
    );
  }

  return (
    <Modal
      title="Register"
      Id="register-modal"
      className="testmodal"
      //background="red"
      theme={'Crimson'}
      // background={'Red'}
      //  preset={'ResetPassword'}
      type="auth"
      elements={stressTestData}
      onSubmit={(data) => console.log(data)}
      onChange={(data) => console.log(data)}
    />
  );
}
