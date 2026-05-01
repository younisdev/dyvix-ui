---
title: Dyvix Button
next:
  text: 'File Component'
  link: 'components/file/file'
---

---

# Dyvix Button

A config-driven animated button component with support for themed and default coloring styles.

## Attributes

- `animation`
  - : `string`. Controls the entrance animation of the button. See the [Animation Presets](/guide/animations) for a full list.
- `className`
  - : `string`. Contains a custom class for your button, allowing more control for the developer.
- `theme`
  - : `string`. Controls the design and the feel of the button. See the [Themes list](/components/modal/themes) for a full list.
- `background`
  - : `string`. Controls the button background color and feel.
- `color`
  - : `string`. Controls the button text color.
- `onClick`
  - : `function`. A callback function triggered upon button click.

## Example

```jsx
import { DyvixButton } from 'dyvix-ui';

function ButtonExample() {
  return (
    <DyvixButton
      onClick={() => console.log('clicked')}
      animation={'bubble'}
      theme={DYVIX_MODAL_THEME.MIDNIGHT}
    >
      Submit
    </DyvixButton>
  );
}
```
