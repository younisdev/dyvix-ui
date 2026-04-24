import { Modal, DYVIX_MODAL_THEME, DYVIX_GLOBAL_ANIMATION } from 'dyvix-ui';
import React from 'react';
export function ModalTest() {
  const testData = Array.from({ length: 9 }, (_, i) => ({
    type: 'text',
    name: `field_${i}`,
    placeholder: `Extended Field ${i + 1}`,
    amount: 1
  }));

  return (
      <ReleaseBenchmark theme="AURORA">

    <Modal
      title="Register"
      Id="register-modal"
      className="modalsss"
      theme="Aurora"
      animation="glitch"
      type="form"
      elements={[
        {
          type: 'text',
          placeholder: ['First Name', 'Last Name'],
          id: 'name',
          name: ['firstName', 'lastName'],
          className: 'ex-text',
          amount: 2
        },    {
      type: "d-select",
      amount: 3,
      placeholder: ["Select Size", "Choose Color", "Shipping Method"],
      name: ["Size", "Color", "Method"],
      options: [
        ["Small", "Medium", "Large"],
        ["Red", "Blue", "Green"],
        ["Standard", "Express", "Prime"]
      ]
    },
        {
          type: 'password',
          placeholder: 'Password',
          validation: 'password',
          id: 'password',
          name: 'password',
          className: 'ex-text',
          amount: 1
        }
      ]}
      onSubmit={(data) => console.log(data)}
      onChange={(data) => console.log(data)}
    />

    </ReleaseBenchmark>

  );
}


const ReleaseBenchmark = ({ theme, children }) => {
  const [report, setReport] = React.useState(null);
const startTime = React.useRef(performance.now());

React.useLayoutEffect(() => {
  const endTime = performance.now();
  const total = (endTime - startTime.current).toFixed(3);
  setReport(total);
  startTime.current = performance.now(); // reset for next theme change
  console.log(`%c [DYVIX TEST] ${theme}: ${total}ms`, "color: #00ffcc; font-weight: bold;");
}, [theme]);

  return (
    <div style={{ border: '1px solid #222', padding: '10px', borderRadius: '8px' }}>
      <div style={{ fontSize: '10px', color: '#888' }}>
        Render Time: <span style={{ color: '#00ffcc' }}>{report}ms</span>
      </div>
      {children}
    </div>
  );
};

