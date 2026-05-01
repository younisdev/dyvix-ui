---
title: Dyvix File
---

# Dyvix File

A config-driven animated File component with support for themed and default coloring styles.

## Attributes

- `label`
  - : `string`. The call to action text of the file. Defaults to `Upload File`.
- `multiple`
  - : `boolean`. Determines whether or not the user can upload multiple files.
- `accept`
  - : `string`. Determines the supported file types. Example: `".jpg, .jpeg, .png"`.
- `animation`
  - : `string`. Controls the entrance animation of the file. See the [Animation Presets](/guide/animations) for a full list.
- `className`
  - : `string`. Contains a custom class for your file, allowing more control for the developer.
- `theme`
  - : `string`. Controls the design and the feel of the file. See the [Themes list](/components/modal/themes) for a full list.
- `background`
  - : `string`. Controls the file background color and feel.
- `color`
  - : `string`. Controls the file text color.
- `onUpload`
  - : `function`. A callback function triggered upon uploading a file.

## Example

```jsx
import {
  DyvixFile,
  DYVIX_GLOBAL_ANIMATION,
  DYVIX_GLOBAL_THEME
} from 'dyvix-ui';

function FileExample() {
  return (
    <DyvixFile
      onUpload={(data) => console.log(data)}
      multiple={true}
      theme={DYVIX_GLOBAL_THEME.MIDNIGHT}
      animation={DYVIX_GLOBAL_ANIMATION.AURORA}
      accept={'.jpg, .jpeg, .png'}
    />
  );
}
```
