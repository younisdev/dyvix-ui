---
title: Select overrides
---

# Select overrides

Select style overrides represent a set of typed CSS Variables that allow easier control for the developer rather than using normal styling.

## Usage

```tsx
<DyvixSelect
  type="select"
  elements={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
  overrides={{
    '--dyvix-select-width': '100%',
    '--dyvix-select-input-bg': '#0f172a',
    '--dyvix-select-input-color': '#f8fafc',
    '--dyvix-select-input-border-color': '#334155',
    '--dyvix-select-input-border-radius': '6px',
    '--dyvix-select-input-focus-border-color': '#3b82f6',
    '--dyvix-select-dropdown-bg': '#1e293b',
    '--dyvix-select-dropdown-border-color': '#334155',
    '--dyvix-select-dropdown-color': '#f8fafc',
    '--dyvix-select-dropdown-hover-bg': '#334155'
  }}
/>
```

## Available Overrides

- `--dyvix-select-color`: `color || string`
- `--dyvix-select-letter-spacing`: `-0.02em || -0.01em || 0em || string`
- `--dyvix-select-border-width`: `0px || 1px || 2px || string`,
- `--dyvix-select-border-style`: `solid || dashed || dotted || double || none || string`
- `--dyvix-select-border-radius`: `0px || 4px || 6px || 8px || 9999px || string`
- `--dyvix-select-transition`: `string || none`
- `--dyvix-select-hover-color`: `color || string`
- `--dyvix-select-hover-border-width`: `0px || 1px || 2px || string`
- `--dyvix-select-hover-border-style`: `solid || dashed || dotted || double || none || string`
- `--dyvix-select-hover-border-radius`: `0px || 4px || 6px || 8px || 9999px || string`
- `--dyvix-select-hover-transform`: `scale(1.009) || none || translateY(1px) || scale(0.98) || string`
- `--dyvix-select-bg`: `color || transparent || string`
- `--dyvix-select-font-family`: `Geist || system-ui || monospace || string`
- `--dyvix-select-font-size`: `0.875rem || 0.9rem || 1rem || 1.125rem || string`
- `--dyvix-select-font-weight`: `400 || 500 || 600 || 700 || string`
- `--dyvix-select-border-color`: `color || transparent`
- `--dyvix-select-box-shadow`: `none || inset 0 1px 0 0 rgba(255, 255, 255, 0.05) || string`
- `--dyvix-select-hover-bg`: `color || transparent || string`
- `--dyvix-select-hover-box-shadow`: `none || inset 0 1px 0 0 rgba(255, 255, 255, 0.05) || string`
- `--dyvix-select-hover-border-color`: `color || transparent`
- `--dyvix-select-width`: `fit-content || 100% || auto || string`
- `--dyvix-select-height`: `fit-content || 100% || auto || string`
- `--dyvix-select-display`: `inline-block || block || inline-flex || flex || inline || grid || none || string`
- `--dyvix-select-input-bg`: `color || transparent || string`
- `--dyvix-select-input-border-color`: `color || transparent`
- `--dyvix-select-input-box-shadow`: `none || inset 0 1px 0 0 rgba(255, 255, 255, 0.05) || string`
- `--dyvix-select-input-color`: `color || string`
- `--dyvix-select-input-border-width`: `0px || 1px || 2px || string`
- `--dyvix-select-input-border-style`: `solid || dashed || dotted || double || none || string`
- `--dyvix-select-input-border-radius`: `0px || 4px || 6px || 8px || 9999px || string`
- `--dyvix-select-input-hover-bg`: `color || transparent || string`
- `--dyvix-select-input-hover-border-color`: `color || transparent`
- `--dyvix-select-input-hover-box-shadow`: `none || inset 0 1px 0 0 rgba(255, 255, 255, 0.05) || string`
- `--dyvix-select-input-hover-color`: `color || string`
- `--dyvix-select-input-hover-border-width`: `0px || 1px || 2px || string`
- `--dyvix-select-input-hover-border-style`: `solid || dashed || dotted || double || none || string`
- `--dyvix-select-input-hover-border-radius`: `0px || 4px || 6px || 8px || 9999px || string`
- `--dyvix-select-input-focus-bg`: `color || transparent || string`
- `--dyvix-select-input-focus-border-color`: `color || transparent`
- `--dyvix-select-input-focus-box-shadow`: `none || inset 0 1px 0 0 rgba(255, 255, 255, 0.05) || string`
- `--dyvix-select-input-focus-color`: `color || string`
- `--dyvix-select-input-focus-border-width`: `0px || 1px || 2px || string`
- `--dyvix-select-input-focus-border-style`: `solid || dashed || dotted || double || none || string`
- `--dyvix-select-input-focus-border-radius`: `0px || 4px || 6px || 8px || 9999px || string`
- `--dyvix-select-dropdown-bg`: `color || transparent || string`
- `--dyvix-select-dropdown-border-color`: `color || transparent`
- `--dyvix-select-dropdown-box-shadow`: `none || inset 0 1px 0 0 rgba(255, 255, 255, 0.05) || string`
- `--dyvix-select-dropdown-color`: `color || string`
- `--dyvix-select-dropdown-border-width`: `0px || 1px || 2px || string`
- `--dyvix-select-dropdown-border-style`: `solid || dashed || dotted || double || none || string`
- `--dyvix-select-dropdown-border-radius`: `0px || 4px || 6px || 8px || 9999px || string`
- `--dyvix-select-dropdown-text-align`: `left || center || right || string`
- `--dyvix-select-dropdown-max-height`: `150px || 200px || 300px || string`
- `--dyvix-select-dropdown-webkit-scrollbar-thumb-bg`: `color || string`
- `--dyvix-select-dropdown-hover-bg`: `color || transparent || string`
- `--dyvix-select-dropdown-hover-border-color`: `color || transparent`
- `--dyvix-select-dropdown-hover-box-shadow`: `none || inset 0 1px 0 0 rgba(255, 255, 255, 0.05) || string`
- `--dyvix-select-dropdown-hover-color`: `color || string`
- `--dyvix-select-dropdown-hover-border-width`: `0px || 1px || 2px || string`
- `--dyvix-select-dropdown-hover-border-style`: `solid || dashed || dotted || double || none || string`
- `--dyvix-select-dropdown-hover-border-radius`: `0px || 4px || 6px || 8px || 9999px || string`
