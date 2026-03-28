<h1 align="center">
  <img width="100" height="100" alt="Dyvix logo" src="https://raw.githubusercontent.com/younisdev/dyvix-ui/main/src/static/logo.png" />
  <br />
  Dyvix UI
</h1>
<h4 align="center">
  Dyvix is an open source, modern, config-driven, animated component UI library. Beautiful by default, customizable by design.
</h4>
<p align="center">
  <img src="https://img.shields.io/npm/v/dyvix-ui?color=bf5af2&style=flat-square" />
  <img src="https://img.shields.io/npm/l/dyvix-ui?color=0ea5e9&style=flat-square" />
  <img src="https://img.shields.io/github/stars/younisdev/dyvix-ui?color=ff6ac1&style=flat-square" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/younisdev/dyvix-ui/main/src/static/demo.gif" alt="Dyvix UI Demo" width="300" height="300" />
</p>

# React

npm i dyvix-ui

````

### Basic usage
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
            { type: "text", placeholder: ["First Name", "Last Name"], id: "name", name: ["firstName", "lastName"], className: "ex-text", amount: 2 },
            { type: "email", placeholder: "Email", validation: ["email"], id: "email", name: "email", className: "ex-text", amount: 1 },
            { type: "password", placeholder: "Password", validation: ["password"], id: "password", name: "password", className: "ex-text", amount: 1 },
          ]}
          onSubmit={(data) => console.log(data)}
        />
    )
}
````

Full Documentation & Live Demos: [dyvix-ui.vercel.app](https://dyvix-ui.vercel.app/)

## Contributing

Feel free to open meaningful issues and prs. Check our [contributing guide](CONTRIBUTING.md) and open contribution trackers:

- Add new [themes](https://github.com/younisdev/dyvix-ui/issues/14)
- Add new [animations](https://github.com/younisdev/dyvix-ui/issues/15)

## Note

This project is still in early alpha expect some bugs and unfinished code.
