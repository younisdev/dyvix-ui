# Modal

The modal component is a core Dyvix UI component. It's a config driven, animated modal engine that supports multiple themes, animations, and validation presets out of the box.

## Basic usage

```jsx
import {
  Modal,
  DYVIX_MODAL_THEME,
  DYVIX_MODAL_VALIDATION_PRESET,
  DYVIX_GLOBAL_ANIMATION
} from 'dyvix-ui';

function ModalExample() {
  return (
    <Modal
      title="Register"
      Id="register-modal"
      Class="modal"
      theme={DYVIX_MODAL_THEME.SINGULARITY}
      animation={DYVIX_GLOBAL_ANIMATION.GLITCH}
      elements={[
        {
          type: 'text',
          placeholder: ['First Name', 'Last Name'],
          id: 'name',
          name: ['firstName', 'lastName'],
          className: 'ex-text',
          amount: 2
        },
        {
          type: 'email',
          placeholder: 'Email',
          validation: [DYVIX_MODAL_VALIDATION_PRESET.EMAIL],
          id: 'email',
          name: 'email',
          className: 'ex-text',
          amount: 1
        },
        {
          type: 'password',
          placeholder: 'Password',
          validation: [DYVIX_MODAL_VALIDATION_PRESET.PASSWORD],
          id: 'password',
          name: 'password',
          className: 'ex-text',
          amount: 1
        }
      ]}
      onSubmit={(data) => console.log(data)}
      onChange={(data) => console.log(data)}
    />
  );
}
```

## Available Themes 🎨

|                  Singularity                   |               Ember                |               Neon               |
| :--------------------------------------------: | :--------------------------------: | :------------------------------: |
| ![Singularity](/sitedemos/singularityanim.gif) | ![Ember](/sitedemos/emberanim.gif) | ![Neon](/sitedemos/neonanim.gif) |
|        `DYVIX_MODAL_THEME.SINGULARITY`         |     `DYVIX_MODAL_THEME.EMBER`      |     `DYVIX_MODAL_THEME.NEON`     |

|                Aurora                |               Frost                |               Blade                |
| :----------------------------------: | :--------------------------------: | :--------------------------------: |
| ![Aurora](/sitedemos/auroraanim.gif) | ![Frost](/sitedemos/frostanim.gif) | ![Blade](/sitedemos/bladeanim.gif) |
|      `DYVIX_MODAL_THEME.AURORA`      |     `DYVIX_MODAL_THEME.FROST`      |     `DYVIX_MODAL_THEME.BLADE`      |
