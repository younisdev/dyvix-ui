---
title: Button overrides
---

# Button overrides

Button style overrides represent a set of typed CSS Variables that allow easier control for the developer rather than using normal styling.

## Usage

```tsx
<DyvixButton
  onClick={() => console.log('clicked')}
  overrides={{
    '--dyvix-button-bg': '#0a0a0f',
    '--dyvix-button-color': '#e2e8f0',
    '--dyvix-button-font-family': 'Geist',
    '--dyvix-button-font-weight': 600,
    '--dyvix-button-border-radius': '9999px',
    '--dyvix-button-border-width': '1px',
    '--dyvix-button-border-color': '#c084fc',
    '--dyvix-button-padding': '10px 22px',

    // Hover State
    '--dyvix-button-hover-bg': '#c084fc',
    '--dyvix-button-hover-color': '#0f172a',

    // Active / Press State
    '--dyvix-button-active-transform': 'scale(0.98)'
  }}
>
  Submit
</DyvixButton>
```

## Available Overrides

- `--dyvix-button-padding`: `string`,
- `--dyvix-button-color`: `color || string`,
- `--dyvix-button-letter-spacing`: `string`,
- `--dyvix-button-border-width`: `string`,
- `--dyvix-button-border-style`: `solid || dashed || dotted || double || none || string`,
- `--dyvix-button-border-radius`: `0px || 4px || 6px || 8px || 9999px || string`,
- `--dyvix-button-transition`: `string || none`,
- `--dyvix-button-hover-color`: `color || string`,
- `--dyvix-button-hover-transform`: `none || translateY(-1px) || scale(1.02) || string`,
- `--dyvix-button-hover-border-width`: `string`,
- `--dyvix-button-hover-border-style`: `solid || dashed || string || none`,
- `--dyvix-button-hover-border-radius`: `string`,
- `--dyvix-button-active-transform`: `none || translateY(1px) || scale(0.98) || string`,
- `--dyvix-button-active-border-width`: `string`,
- `--dyvix-button-active-border-style`: `solid || dashed || string || none`,
- `--dyvix-button-active-color`: `color || string`,
- `--dyvix-button-active-border-radius`: `string`
- `--dyvix-button-bg`: `color || transparent || string`,
- `--dyvix-button-font-family`: `Geist || system-ui || monospace || string`,
- `--dyvix-button-font-size`: `string`,
- `--dyvix-button-font-weight`: `string`,
- `--dyvix-button-border-color`: `color || transparent`,
- `--dyvix-button-box-shadow`: `none || string`,
- `--dyvix-button-hover-bg`: `color || transparent || string`,
- `--dyvix-button-hover-border-color`: `color || transparent`,
- `--dyvix-button-hover-box-shadow`: `none || string`,
- `--dyvix-button-active-bg`: `color || transparent || string`,
- `--dyvix-button-active-border-color`: `color || transparent`,
- `--dyvix-button-active-box-shadow`: `none || string`
- `--dyvix-button-width`: `fit-content || 100% || auto || string`,
- `--dyvix-button-height`: `fit-content || 100% || auto || string`,
- `--dyvix-button-display`: `inline-block || block || inline-flex || flex || inline || grid || none || string`
