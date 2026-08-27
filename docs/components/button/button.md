---
title: Dyvix Button
next:
  text: 'File Component'
  link: 'components/file/file'
---

# Dyvix Button

A config-driven animated button component with support for themed and default coloring styles.

## Attributes

- `animation`
  - : `string`. Controls the entrance animation of the button. See the [Animation Presets](/guide/animations) for a full list.
- `overrides`
  - : `DyvixButtonOverrides || Record<string, string | number>`. An object of typed CSS Variables allowing deep easy-customization of the component. See [button overrides](/components/button/overrides.md) for more information.
- `className`
  - : `string`. Contains a custom class for your button, allowing more control for the developer.
- `theme`
  - : `string`. Controls the design and the feel of the button. See the [Themes list](/guide/themes) for a full list.
- `background`
  - : `string`. Controls the button background color and feel.
- `color`
  - : `string`. Controls the button text color.
- `onClick`
  - : `function`. A callback function triggered upon button click.

## Example

```jsx
import {
  DyvixLabel,
  DYVIX_GLOBAL_ANIMATION,
  DYVIX_GLOBAL_THEME
} from 'dyvix-ui';

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

## Try it

<ButtonPlayground />
