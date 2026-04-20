import { Modal, DYVIX_MODAL_THEME, DYVIX_GLOBAL_ANIMATION } from 'dyvix-ui';

export function ModalTest() {
  const testData = Array.from({ length: 9 }, (_, i) => ({
    type: 'text',
    name: `field_${i}`,
    placeholder: `Extended Field ${i + 1}`,
    amount: 1
  }));

  return (
    <Modal
      theme={DYVIX_MODAL_THEME.OCEAN}
      animation={DYVIX_GLOBAL_ANIMATION.AURORA}
      preset={'Login'}
      //onSubmit={(data) => console.log(data)}
    />
  );
}
