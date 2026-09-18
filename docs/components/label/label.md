---
title: Dyvix Label
next:
  text: 'Table Component'
  link: 'components/table/table'
---

# Dyvix Label

A config-driven animated label component with support for themed and default coloring styles.

## Attributes

- `className`
  - : `string`. Contains a custom class for your Label, allowing more control for the developer.
- `overrides`
  - : `Record<string, string | number>`. An object of typed CSS Variables allowing deep easy-customization of the component. See [label overrides](/components/label/overrides.md) for more information.
- `htmlFor`
  - : `string`. Links the label to a form associated element.
- `animation`
  - : `string`. Controls the entrance animation of the button. See the [Animation Presets](/guide/animations) for a full list.
- `theme`
  - : `string`. Controls the design and the feel of the button. See the [Themes list](/guide/themes) for a full list.
- `timeline`
  - : `function`. A GSAP callback function that allows an external `gsap.timeline()` instance to control the component's internal animations.
  
## Example

```jsx
import {
  DyvixLabel,
  DYVIX_GLOBAL_ANIMATION,
  DYVIX_GLOBAL_THEME
} from 'dyvix-ui';

function LabelExample() {
  return (
    <DyvixLabel
      htmlFor="name"
      animation={DYVIX_GLOBAL_ANIMATION.DRIFT}
      theme={DYVIX_GLOBAL_THEME.CRIMSON}
    >
      Enter your name
    </DyvixLabel>
  );
}
```

## Try it

<LabelPlayground />
