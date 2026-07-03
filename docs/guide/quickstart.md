---
title: Quick start
---

# Quick start

## 1 - Installation

```bash
npm i dyvix-ui
```

## 2 - Setup basic modal

```jsx
// Basic usage

import { Modal } from 'dyvix-ui';

function ModalExample() {
  return (
    <Modal
      title="Register"
      animation="bubble"
      Id="register-modal"
      className="modal"
      theme="Singularity"
      e
      elements={[
        {
          type: 'text',
          placeholder: ['First Name', 'Last Name'],
          id: 'name',
          name: ['firstName', 'lastName'],
          className: 'ex-text',
          amount: 2
        },
        {
          type: 'email',
          placeholder: 'Email',
          validation: ['email'],
          id: 'email',
          name: 'email',
          className: 'ex-text',
          amount: 1
        },
        {
          type: 'password',
          placeholder: 'Password',
          validation: ['password'],
          id: 'password',
          name: 'password',
          className: 'ex-text',
          amount: 1
        }
      ]}
      onSubmit={(data) => console.log(data)}
      onChange={(data) => console.log(data)}
    />
  );
}
```

## 3 - Setup basic select

```jsx
import { DyvixSelect } from 'dyvix-ui';

function SelectExample() {
  return (
    <DyvixSelect
      className="ex-select"
      type="select"
      elements={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
      onChange={(data) => console.log(data)}
    />
  );
}
```
