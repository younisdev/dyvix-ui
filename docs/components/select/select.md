---
title: Dyvix Select
next:
  text: 'Toast Component'
  link: 'components/toast/toast'
---

# Dyvix Select

A config-driven animated select component with support for normal and autocomplete modes.

## Attributes

- `elements`
  - : `Array`. The list of elements to display in the select dropdown.
- `onChange`
  - : `function`. A callback function triggered every time the select value changes. It receives the value directly.
- `type`
  - : `string`. The type of the select component. Defaults to `select`.
- `theme`
  - : `string`. Controls the design and the feel of the select. See the [Themes list](/guide/themes) for a full list.
- `animation`
  - : `string`. Controls the entrance animation of the select. See the [Animation Presets](/guide/animations) for a full list.
- `className`
  - : `string`. Contains a custom class for your select, allowing more control for the developer.
- `placeholder`
  - : `string`. The text displayed when no option is selected.

## Types

Dyvix Select Includes 2 types of select each type behaving differnetly:

- `select`
  - : Standard dropdown select behavior.
- `autocomplete`
  - : Filters options as the user types.

## Example

```jsx
import { DyvixSelect } from 'dyvix-ui';

function SelectExample() {
  return (
    <DyvixSelect
      className="ex-select"
      type="select"
      theme="Singularity"
      elements={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
      onChange={(data) => console.log(data)}
    />
  );
}
```

## Try it

<SelectPlayground />
