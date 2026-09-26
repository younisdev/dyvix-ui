<div align="center">
  <img src="https://raw.githubusercontent.com/younisdev/dyvix-ui/main/src/static/logo.png" width="100" height="100" alt="Dyvix UI Logo" />
  <h1>Dyvix UI</h1>
</div>
<h4 align="center">
  Dyvix is an open source, modern, config-driven, animated component UI library. Beautiful by default, customizable by design.
</h4>
<p align="center">
  <img src="https://img.shields.io/npm/v/dyvix-ui?color=bf5af2&style=flat-square" />
  <a href="https://socket.dev/npm/package/dyvix-ui"><img src="https://socket.dev/api/badge/npm/package/dyvix-ui" /></a>
  <img src="https://img.shields.io/github/stars/younisdev/dyvix-ui?color=ff6ac1&style=flat-square" />
  <img src="https://img.shields.io/npm/l/dyvix-ui?color=0ea5e9&style=flat-square" />
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/younisdev/dyvix-ui/main/src/static/demo.gif" alt="Dyvix UI Demo" width="350" height="300" />
</p>

## Features

- 🎨 **17 global themes** - `Singularity`, `Industrial`, `Ember`, `Frost`, `Blade`, `Neon`, `Aurora`, `Sunset`, `Ocean`, `Forest`, `Midnight`, `Crimson`, `Obsidian`,`Coffee`,`Cosmos`,`Sakura`,`Volcanic` (Component coverage varies between releases).
- ⚡ **Smart JSON Caching (SJC)** - Multi-tier (L1, L2, L3) system for near-zero latency delivery.
- ✨ **16 animation presets** - `fade`, `bubble`, `zoom`, `unfold`, `glitch`, `pulse`, `aurora`, `drop`, `flip`, `glide`, `drift`, `float`, `swing`,`slideRight`,`spiral`,`bounce`.
- 🔧 **Config-driven & composable APIs** - Dual mode support where it makes sense.
- 🗂️ **Sortable tables** - Multi-column sorting.
- 🧩 **Modal engine** - JSON-driven with validation, presets, file upload, radio, and more.
- ♿ **Accessible** - ARIA attributes and keyboard navigation throughout.
- 📦 **37.9 kB packed** - Lean, headless-first architecture with zero bloat.

## Why Dyvix?

Unlike traditional component libraries, Dyvix focuses on config-driven workflows where they provide the most value, with optional animation and theme systems that can be customized without rewriting component logic.

# React

```bash
npm i dyvix-ui
```

## Basic usage

### Form Modal Engine

```jsx
import { DyvixModal } from 'dyvix-ui';

function ModalExample() {
  return (
    <DyvixModal
      title="Register"
      type="form"
      animation="bubble" // bubble | fade | zoom | unfold | glitch | pulse | aurora | drop | flip | glide | drift | float | swing | slideRight | spiral | bounce
      Id="register-modal"
      className="modal"
      theme="Singularity" // Singularity | Industrial | Ember | Frost | Blade | Neon | Aurora | Sunset | Ocean | Forest | Midnight | Crimson | Obsidian | Coffee | Cosmos | Sakura | Volcanic
      elements={[
        {
          type: 'text',
          placeholder: ['First Name', 'Last Name'],
          id: 'name',
          name: ['firstName', 'lastName'],
          amount: 2
        },
        {
          type: 'email',
          placeholder: 'Email',
          validation: ['email'],
          id: 'email',
          name: 'email',
          amount: 1
        },
        {
          type: 'password',
          placeholder: 'Password',
          validation: ['password'],
          id: 'password',
          name: 'password',
          amount: 1
        }
      ]}
      onSubmit={(data) => console.log(data)}
    />
  );
}
```

### Global Notifications

```jsx
import { DyvixToastContainer, dyvixToast } from 'dyvix-ui';

function ToastExample() {
  function notify() {
    dyvixToast.success('This is a new message');
  }

  return (
    <>
      <DyvixToastContainer
        position="top-right"
        duration={5000}
        animation="fade"
      />
      <button onClick={notify}>Notify</button>
    </>
  );
}
```

### Dual-API Table support

Config-driven table mode includes an exclusive realtime multi-column sorting.

```jsx
import {
  DyvixTable,
  DyvixTableHeader,
  DyvixTableBody,
  DyvixTableRow,
  DyvixTableHead,
  DyvixTableCell
} from 'dyvix-ui';

function Dual_API_Table_Example() {
  return (
    <>
      {/* Config-driven Mode */}
      <DyvixTable
        theme="Crimson"
        columns={[
          { key: 'name', label: 'Name', sortable: true },
          { key: 'type', label: 'Type' }
        ]}
        data={[
          { name: 'Lion', type: 'Wild' },
          { name: 'Hawk', type: 'Bird' }
        ]}
      />

      {/* Composable Mode */}
      <DyvixTable>
        <DyvixTableHeader>
          <DyvixTableRow>
            <DyvixTableHead>Name</DyvixTableHead>
            <DyvixTableHead>Type</DyvixTableHead>
          </DyvixTableRow>
        </DyvixTableHeader>
        <DyvixTableBody>
          <DyvixTableRow>
            <DyvixTableCell>Lion</DyvixTableCell>
            <DyvixTableCell>Wild</DyvixTableCell>
          </DyvixTableRow>
        </DyvixTableBody>
      </DyvixTable>
    </>
  );
}
```

Full Documentation & Live Demos: [dyvix-ui.vercel.app](https://dyvix-ui.vercel.app/)

## Contributing

Feel free to open meaningful issues and PRs. Check our [contributing guide](CONTRIBUTING.md) and open contribution trackers:

- Add new [themes](https://github.com/younisdev/dyvix-ui/issues/14)
- Add new [animations](https://github.com/younisdev/dyvix-ui/issues/15)
