---
title: Dyvix Input
next:
  text: 'Label Component'
  link: 'components/label/label'
---

# Dyvix Input

A config-driven animated input component with support for themed and default coloring styles.

## Attributes

- `type`
  - : `string`. Determines inputs type. Defaults to `text`.
- `placeholder`
  - : `string`. The text displayed when the input is empty.
- `autoComplete`
  - : `string`. The autocomplete hint passed to the underlying input element.
- `overrides`
  - : `Record<string, string | number>`. An object of typed CSS Variables allowing deep easy-customization of the component. See [input overrides](/components/input/overrides.md) for more information.
- `theme`
  - : `string`. Controls the design and the feel of the input. See the [Themes list](/guide/themes) for a full list.
- `background`
  - : `string`. Controls the input background color and feel.
- `color`
  - : `string`. Controls the input text color.
- `animation`
  - : `string`. Controls the entrance animation of the input. See the [Animation Presets](/guide/animations) for a full list.
- `className`
  - : `string`. Determines a custom class for your input, allowing more control for the developer.
- `name`
  - : `string`. The name attribute for input element, used for form submission.
- `id`
  - : `string`. The id attribute for input element, used for accessibility and label association.
- `disabled`
  - : `boolean`. Disable the input when true.
- `aria-label`
  - : `string`. Accessible label for the input element.
- `onFocus`
  - : `function`. A callback function triggered when the input gains focus.
- `onBlur`
  - : `function`. A callback function triggered when the input loses focus.
- `onChange`
  - : `function`. A callback function triggered upon input value change.
- `onKeyDown`
  - : `function`. A callback function triggered when a key is pressed while the input is focused.
- `onKeyUp`
  - : `function`. A callback function triggered when a key is released while the input is focused.

## Try it

<InputPlayground />

## Example

```jsx
import {
  DyvixInput,
  DYVIX_GLOBAL_ANIMATION,
  DYVIX_GLOBAL_THEME
} from 'dyvix-ui';
function InputExample() {
  return (
    <DyvixInput
      animation={DYVIX_GLOBAL_ANIMATION.AURORA}
      theme={DYVIX_GLOBAL_THEME.MIDNIGHT}
      type="text"
      placeholder="Enter your name"
      onChange={(e) => {
        console.log(e.target.value);
      }}
      onKeyDown={(e) => {
        console.log('Key down:', e.key);
      }}
      onKeyUp={(e) => {
        console.log('Key up:', e.key);
      }}
    />
  );
}
```
