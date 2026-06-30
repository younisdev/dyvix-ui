---
title: Modal Presets
next:
  text: 'Select'
  link: 'components/select/select'
---

# Modal Presets

Modal presets represent a premade config for common modal usecases.

## Available elements

Dyvix provides a wide range of presets. You can trigger these by passing the string name.

- `'Register'`
- `'Login'`

## Usage

```jsx
import { Modal } from 'dyvix-ui';

function AuthModal() {
  return <Modal preset="Login" title="Welcome Back" theme="Aurora" />;
}
```
