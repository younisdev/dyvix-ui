import { dyvixToast, DyvixToastContainer } from '../../../src';

export function ToastTest() {
  function notify() {
    dyvixToast.success('This a new message');
  }
  return (
    <>
      <DyvixToastContainer
        position="top-right"
        duration={5000}
        animation="bubble"
        segments={8}
      />
      <button onClick={notify}>Notify</button>
    </>
  );
}
