---
title: Dyvix Modal
next:
  text: 'Select'
  link: 'components/select/select'
---

# Modal

The modal component is a core Dyvix UI component. It's a config driven, animated modal engine that supports multiple themes, animations, and validation presets out of the box.

## Attributes

- `title`
  - : `string`. Represents the header of the modal.
- `Id`
  - : `string`. A Unique ID for your modal, allowing more control for the developer.
- `Class`
  - : `string`. Contains a custom class for your modal, allowing more control for the developer.
- `type`
  - : `string`. Represents the type of the modal. Defaults to `form`.
- `theme`
  - : `string`. Controls the design and the feel of the modal.
- `animation`
  - : `string`. Controls the entrance animation of the modal.
- `preset`
  - : `string`. A convenience attribute that populates the modal with predefined configuration. Using presets overrides elements attribute with modal common-uses.
- `elements`
  - : An array of objects that defines the internal fields of the modal. Each object supports the following attributes:
    - `amount`
      - : `number`. The number of inputs to display per row. Supported values are between 1 and 3.
    - `type`
      - : `string`. The type of input to render in this specific row.
    - `name`
      - : `string | string[]`. The key used in the `onSubmit` callback. If the amount is greater than 1 this must be provided as an array of strings with length matching that of the amount.
    - `placeholder`
      - : `string | string[]`. The text displayed when the input is empty. If the amount is greater than 1 this must be provided as an array of strings with length matching that of the amount.
    - `options`
      - : `Array of Array[values]`. Required when type is `select`, `d-select`, and `autocomplete`. It provides selection data for the supported elements, the amount of sub-arrays must match the amount property. For example:

        ```jsx
            {
              type: "select",
              amount: 3,
              placeholder: ["Select Size", "Choose Color", "Shipping Method"],
              name: ["Size", "Color", "Method"],
              options: [
                ["Small", "Medium", "Large"],
                ["Red", "Blue", "Green"],
                ["Standard", "Express", "Prime"]
              ]
            }
        ```

    - `validation`
      - : `string | string[]`. Premade validation preset. If the amount is greater than 1 this must be provided as an array of strings with length matching that of the amount.

- `onSubmit`
  - : `function`. A callback function triggered upon form submission. It receives a single `data` object containing all input names along with their value.
- `onChange`
  - : `function`. A callback function triggered every time an input value changes. It receives a single `data` object containing all input names along with their value.
- `onClose`
  - : `function`. A callback function triggered upon form closure. Available only when the modal `type` is set to `form`.

## Understanding Dyvix Constants

Dyvix constants are a built-in configuration engine designed to eliminate "magic strings" and provide a type-safe environment for dyvix users. By using these exported constants you benefit from IDE autocompletion preventing common typos that could break your UI. The modal component currently supports 5 constants groups:

- `DYVIX_MODAL_THEME`
  - : Used in the theme attribute e.g. `theme={DYVIX_MODAL_THEME.NEON}`.
- `DYVIX_GLOBAL_ANIMATION`
  - : Used in the animation attribute e.g. `animation={DYVIX_GLOBAL_ANIMATION.AURORA}`.
- `DYVIX_MODAL_TYPE`
  - : Used in the modal type e.g. `type={DYVIX_MODAL_TYPE.AUTH}`
- `DYVIX_MODAL_VALIDATION_PRESET`
  - : Used in the modal elements validation e.g. `validation: [DYVIX_MODAL_VALIDATION_PRESET.EMAIL]`
- `DYVIX_MODAL_ELEMENT`
  - : Used in the modal elements type e.g. `type: DYVIX_MODAL_ELEMENT.TEXT`

## Example

### Without Dyvix Constants

```jsx
import { Modal } from 'dyvix-ui';

function ModalExample() {
  return (
    <Modal
      title="Register"
      Id="register-modal"
      Class="modal"
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
        },
        {
          type: 'email',
          placeholder: 'Email',
          validation: 'email',
          id: 'email',
          name: 'email',
          className: 'ex-text',
          amount: 1
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
  );
}
```

### Using Dyvix Constants

```jsx
import {
  Modal,
  DYVIX_MODAL_THEME,
  DYVIX_MODAL_VALIDATION_PRESET,
  DYVIX_GLOBAL_ANIMATION,
  DYVIX_MODAL_ELEMENT,
  DYVIX_MODAL_TYPE
} from 'dyvix-ui';

function ModalExample() {
  return (
    <Modal
      title="Register"
      Id="register-modal"
      Class="modal"
      theme={DYVIX_MODAL_THEME.AURORA}
      animation={DYVIX_GLOBAL_ANIMATION.GLITCH}
      type={DYVIX_MODAL_TYPE.AUTH}
      elements={[
        {
          type: DYVIX_MODAL_ELEMENT.TEXT,
          placeholder: ['First Name', 'Last Name'],
          id: 'name',
          name: ['firstName', 'lastName'],
          className: 'ex-text',
          amount: 2
        },
        {
          type: DYVIX_MODAL_ELEMENT.EMAIL,
          placeholder: 'Email',
          validation: [DYVIX_MODAL_VALIDATION_PRESET.EMAIL],
          id: 'email',
          name: 'email',
          className: 'ex-text',
          amount: 1
        },
        {
          type: DYVIX_MODAL_ELEMENT.PASSWORD,
          placeholder: 'Password',
          validation: [DYVIX_MODAL_VALIDATION_PRESET.PASSWORD],
          id: 'password',
          name: 'password',
          className: 'ex-text',
          amount: 1
        },
        {
          type: DYVIX_MODAL_ELEMENT.CHECKBOX,
          name: 'newsletter',
          placeholder: 'Subscribe to dyvix UI newsletter!',
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
