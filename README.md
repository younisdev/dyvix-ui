<div align="center">
  <img src="https://raw.githubusercontent.com/younisdev/dyvix-ui/main/src/static/logo.png" width="100" height="100" alt="Dyvix UI Logo" />
  <h1>Dyvix UI</h1>
</div>
<h4 align="center">
  Dyvix is an open source, modern, config-driven, animated component UI library. Beautiful by default, customizable by design.
</h4>
<p align="center">
  <img src="https://img.shields.io/npm/v/dyvix-ui?color=bf5af2&style=flat-square" />
  <img src="https://img.shields.io/npm/l/dyvix-ui?color=0ea5e9&style=flat-square" />
  <img src="https://img.shields.io/github/stars/younisdev/dyvix-ui?color=ff6ac1&style=flat-square" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/younisdev/dyvix-ui/main/src/static/demo.gif" alt="Dyvix UI Demo" width="350" height="300" />
</p>

## Features

- 🎨 **Multiple themes** - Singularity, Industrial, Ember, Frost, Blade
- ✨ **Rich animations** - bubble, fade, zoom, unfold, glitch
- 🔧 **Config-driven components** - Flexible props for forms, modals, toasts
- ♿ **Accessible** - Built with accessibility in mind
- 📦 **Lightweight** - Minimal dependencies

# React

```bash
npm i dyvix-ui
```

## Basic usage

```jsx
import { Modal } from 'dyvix-ui'

function ModalExample()
{

  return(
        <Modal
          title="Register"
          type="form"
          animation="bubble" // bubble | fade | zoom | unfold | glitch
          Id="register-modal"
          Class="modal"
          theme='Singularity' // Singularity | Industrial | Ember | Frost | Blade
          elements={[
            { type: "text", placeholder: ["First Name", "Last Name"], id: "name", name: ["firstName", "lastName"], amount: 2 },
            { type: "email", placeholder: "Email", validation: ["email"], id: "email", name: "email", amount: 1 },
            { type: "password", placeholder: "Password", validation: ["password"], id: "password", name: "password", amount: 1 },
          ]}
          onSubmit={(data) => console.log(data)}
        />
    )
}
````

```jsx
import { DyvixToastContainer, dyvixToast } from 'dyvix-ui';

function ToastExample()
{
  function notify()
  {
    dyvixToast.success('This a new message');
  }

  return (
    <>
      <DyvixToastContainer position='top-right' duration={5000} animation='fade'/>
      <button onClick={notify}>Notify</button>
    </>
  )
}
```

Full Documentation & Live Demos: [dyvix-ui.vercel.app](https://dyvix-ui.vercel.app/)

## Contributing

Feel free to open meaningful issues and prs. Check our [contributing guide](CONTRIBUTING.md) and open contribution trackers:

- Add new [themes](https://github.com/younisdev/dyvix-ui/issues/14)
- Add new [animations](https://github.com/younisdev/dyvix-ui/issues/15)
