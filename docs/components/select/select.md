---
title: Dyvix Select
next:
  text: 'Toast'
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
import { DynamicSelect } from 'dyvix-ui';

function SelectExample() {
  return (
    <DynamicSelect
      className="ex-select"
      type="select"
      elements={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
      onChange={(data) => console.log(data)}
    />
  );
}
```
