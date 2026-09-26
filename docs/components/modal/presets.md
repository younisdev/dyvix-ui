---
title: Modal Presets
next:
  text: 'Select'
  link: 'components/select/select'
---

# Modal Presets

Modal presets represent a premade config for common modal usecases.

## Available presets

Dyvix provides a wide range of presets. You can trigger these by passing the string name.

- `'Register'`
- `'Login'`
- `'ForgotPassword'`
- `'ResetPassword'`
- `'ChangePassword'`

## Usage

```jsx
import { DyvixModal } from 'dyvix-ui';

function AuthModal() {
  return <DyvixModal preset="Login" title="Welcome Back" theme="Aurora" />;
}
```
