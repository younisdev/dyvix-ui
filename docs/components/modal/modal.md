---
title: Dyvix Modal
next:
  text: 'Modal elements'
  link: '/components/modal/elements'
---

# Modal

## Try it

<ModalPlayground />

The modal component is a core Dyvix UI component. It's a config driven, animated modal engine that supports multiple themes, animations, and validation presets out of the box.

## Attributes

- `title`
  - : `string`. Represents the header of the modal.
- `Id`
  - : `string`. A Unique ID for your modal, allowing more control for the developer.
- `className`
  - : `string`. Contains a custom class for your modal, allowing more control for the developer.
- `type`
  - : `string`. Represents the type of the modal. Defaults to `form`. Supported types are `form` and `auth`.
- `theme`
  - : `string`. Controls the design and the feel of the modal. See the [Themes list](/guide/themes) for a full list.
- `overrides`
  - : `Record<string, string | number>`. An object of typed CSS Variables allowing deep easy-customization of the component. See [modal overrides](/components/modal/overrides) for more information.
- `background`
  - : `string`. Controls the modal background color.
- `dynamicPositioning`
  - : `boolean`. Controls whether the modal applies its calculated centering margins. Defaults to `true`; set it to `false` to position the modal with your own styles.
- `animation`
  - : `string`. Controls the entrance animation of the modal. See the [Animation List](/guide/animations) for a full list.
- `preset`
  - : `string`. A convenience attribute that populates the modal with predefined configuration. Using presets overrides elements attribute with modal common-uses. See the [Preset list](/components/modal/presets) for a full list.
- `elements`
  - : An array of objects that defines the internal fields of the modal. Each object supports the following attributes:
    - `amount`
      - : `number`. The number of inputs to display per row. Supported values are between 1 and 3.
    - `type`
      - : `string`. The type of input to render in this specific row. See the [elements list](/components/modal/elements) for a full list.
    - `name`
      - : `string | string[]`. The key used in the `onSubmit` callback. If the amount is greater than 1 this must be provided as an array of strings with length matching that of the amount.
    - `placeholder`
      - : `string | string[]`. The text displayed when the input is empty. If the amount is greater than 1 this must be provided as an array of strings with length matching that of the amount.
    - `id`
      - : `string | string[]`. A Unique optional ID for individual fields, allowing more control for the developer. If the amount is greater than 1 this must be provided as an array of strings with length matching that of the amount.
    - `options`
      - : `Array of Array[values]`. Required when type is `select`, `d-select`, or `autocomplete`. It provides selection data for the supported elements, the amount of sub-arrays must match the amount property. For example:

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
      - : `string | string[]`. Defines the validation logic of the field. If the amount is greater than 1 this must be provided as an array of strings with length matching that of the amount. Supports built-in presets found in [validators list](/components/modal/validation) or custom patterns by using pattern-embedding prefix `$R`. Moreover, you can embed a custom error message using the | separator. For example:

        ```jsx
        {
          amount: 3,
          validation: ["email", "$R^\\d+$|Numbers only", DYVIX_MODAL_VALIDATION_PRESET.PASSWORD],
        }
        ```

    - `match`
      - : `string | string[]`. Links two modal fields where the current field will only pass validation if its value matches the value of the referenced field's `id`. For example:

        ```jsx
        {
          "type": "password",
          "placeholder": "Confirm Password",
          "id": "confirm-password",
          "name": "confirmPassword",
          "match": "new-password", // The id of the target field
          "amount": 1
        }
        ```

- `steps`
  - : `DyvixModalStep[]`. Turns the modal into a multi-step workflow. Each step has its own `title` and `elements`, and the modal shows one step at a time. When `steps` is provided, the top-level `title` and `elements` props are ignored. See [Multi-step modals](#multi-step-modals).
- `onSubmit`
  - : `function`. A callback function triggered upon form submission. It receives a single `data` object containing all input names along with their value.
- `onChange`
  - : `function`. A callback function triggered every time an input value changes. It receives a single `data` object containing all input names along with their value.
- `onClose`
  - : `function`. A callback function triggered upon form closure. Available only when the modal `type` is set to `form`.
- `timeline`
  - : `function`. A GSAP callback function that allows an external `gsap.timeline()` instance to control the component's internal animations.

## Multi-step modals

Added in v0.5.9, the `steps` prop splits a modal into a guided workflow: one step is shown at a time, with a step indicator, Back / Next navigation, and per-step validation. The values entered on every step are collected into a single object that is passed to `onSubmit` when the last step is submitted.

### How it works

- Each step is an object with a `title` and an `elements` array. The active step's `title` is displayed as the modal header.
- A row of step indicator dots is rendered above the fields whenever the modal has more than one step. The current step's dot is highlighted, and completed steps are marked.
- The action button reads `Next` on every step except the last, where it becomes the modal's submit button. A `Back` button appears from the second step onward.
- Moving to the next step validates only the fields of the current step. If any field is invalid, the modal stays on that step and shows the error.
- `onSubmit` is called only when the final step is submitted and all its fields pass validation. `onChange` fires on every input change and receives the accumulated data from all steps so far.
- Each step's `elements` follow the same rules as the top-level `elements` attribute: the same element types, validation presets, and `match` rules apply within each step. Each step supports a maximum of 9 rows.

### Example

```jsx
import { DyvixModal } from 'dyvix-ui';

function MultiStepModalExample() {
  return (
    <DyvixModal
      type="form"
      steps={[
        {
          title: 'Account Details',
          elements: [
            {
              type: 'text',
              placeholder: 'Username',
              name: 'username',
              validation: 'mandatory',
              amount: 1
            }
          ]
        },
        {
          title: 'Security',
          elements: [
            {
              type: 'password',
              placeholder: 'Password',
              validation: 'password',
              id: 'password',
              name: 'password',
              amount: 1
            },
            {
              type: 'password',
              placeholder: 'Confirm Password',
              validation: 'password',
              id: 'confirm-password',
              name: 'confirmPassword',
              match: 'password',
              amount: 1
            }
          ]
        }
      ]}
      onSubmit={(data) => console.log(data)}
      onChange={(data) => console.log(data)}
    />
  );
}
```

### Exported types

The types for `multi-step modals` are exported from `dyvix-ui`, allowing you to define a typed `steps` array outside the JSX:

```tsx
import { DyvixModal, type DyvixModalStep } from 'dyvix-ui';

const steps: DyvixModalStep[] = [
  {
    title: 'Account Details',
    elements: [
      {
        type: 'text',
        placeholder: 'Username',
        name: 'username',
        validation: 'mandatory',
        amount: 1
      }
    ]
  }
];
```

- `DyvixModalStep`
  - : `{ title: string; elements: DyvixModalElements[] }`. One step of a multi-step modal.
- `NormalizedDyvixModalStep`
  - : The normalized form of a step used internally, with every element field expanded to arrays.

## Understanding Dyvix Constants

Dyvix constants are a built-in configuration engine designed to eliminate "magic strings" and provide a type-safe environment for JavaScript dyvix users. By using these exported constants you benefit from IDE autocompletion preventing common typos that could break your UI. The modal component currently supports 5 constants groups:

- `DYVIX_GLOBAL_THEME`
  - : Used in the theme attribute e.g. `theme={DYVIX_GLOBAL_THEME.NEON}`.
- `DYVIX_GLOBAL_ANIMATION`
  - : Used in the animation attribute e.g. `animation={DYVIX_GLOBAL_ANIMATION.SINGULARITY}`.
- `DYVIX_MODAL_TYPE`
  - : Used in the modal type e.g. `type={DYVIX_MODAL_TYPE.AUTH}`
- `DYVIX_MODAL_VALIDATION_PRESET`
  - : Used in the modal elements validation e.g. `validation: [DYVIX_MODAL_VALIDATION_PRESET.EMAIL]`
- `DYVIX_MODAL_ELEMENT`
  - : Used in the modal elements type e.g. `type: DYVIX_MODAL_ELEMENT.TEXT`

## Example

### Without Dyvix Constants

```jsx
import { DyvixModal } from 'dyvix-ui';

function ModalExample() {
  return (
    <DyvixModal
      title="Register"
      Id="register-modal"
      className="modal"
      theme="SINGULARITY"
      animation="glitch"
      type="form"
      elements={[
        {
          type: 'text',
          placeholder: ['First Name', 'Last Name'],
          id: 'name',
          name: ['firstName', 'lastName'],
          amount: 2
        },
        {
          type: 'email',
          placeholder: 'Email',
          validation: 'email',
          id: 'email',
          name: 'email',
          amount: 1
        },
        {
          type: 'password',
          placeholder: 'Password',
          validation: 'password',
          id: 'password',
          name: 'password',
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
  DyvixModal,
  DYVIX_GLOBAL_THEME,
  DYVIX_MODAL_VALIDATION_PRESET,
  DYVIX_GLOBAL_ANIMATION,
  DYVIX_MODAL_ELEMENT,
  DYVIX_MODAL_TYPE
} from 'dyvix-ui';

function ModalExample() {
  return (
    <DyvixModal
      title="Register"
      Id="register-modal"
      className="modal"
      theme={DYVIX_GLOBAL_THEME.SINGULARITY}
      animation={DYVIX_GLOBAL_ANIMATION.GLITCH}
      type={DYVIX_MODAL_TYPE.AUTH}
      elements={[
        {
          type: DYVIX_MODAL_ELEMENT.TEXT,
          placeholder: ['First Name', 'Last Name'],
          id: 'name',
          name: ['firstName', 'lastName'],
          amount: 2
        },
        {
          type: DYVIX_MODAL_ELEMENT.EMAIL,
          placeholder: 'Email',
          validation: [DYVIX_MODAL_VALIDATION_PRESET.EMAIL],
          id: 'email',
          name: 'email',
          amount: 1
        },
        {
          type: DYVIX_MODAL_ELEMENT.PASSWORD,
          placeholder: 'Password',
          validation: [DYVIX_MODAL_VALIDATION_PRESET.PASSWORD],
          id: 'password',
          name: 'password',
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
