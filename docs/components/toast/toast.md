---
title: Dyvix Toast
---

# Dyvix Toast

A config-driven animated notifaction system consists of global container and indivisual toast nodes.

## Attributes

### Toast container

The container holds & manages toast settings for all outgoing toasts

- `position`
  - : `string`. The position where the container docks. Supported type are : `top-right`, `top-left`, `bottom-right`, `bottom-left`.
- `duration`
  - : `number`. Determine how long an indivisual toast remains visible on the screen. Defaults to `5000` ms.
- `animation`
  - : `string`. Controls the entrance animation of the indivisual toast. Defaults to `zoom`. See the [Animation Presets](/guide/animations) for a full list.
- `segments`
  - : `number`. Controls how many toast are shown per container. Defaults to `10`.

### Toast

- `message`
  - : `string`. The content of the notification.

## Example

```jsx
import { DyvixToastContainer, dyvixToast } from 'dyvix-ui';

function ToastExample() {
  function notify() {
    dyvixToast.success('This a new message');
  }

  return (
    <>
      <DyvixToastContainer
        position="top-right"
        duration={5000}
        animation="fade"
        segments={5}
      />
      <button onClick={notify}>Notify</button>
    </>
  );
}
```
