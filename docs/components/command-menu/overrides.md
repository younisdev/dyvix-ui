---
title: Command Menu overrides
---

# Command Menu overrides

Command Menu style overrides represent a set of typed CSS Variables that allow easier control for the developer rather than using normal styling.

The `background` and `color` props set some of these variables for you. Values passed through `overrides` are applied after them, so an override always wins.

## Usage

```tsx
<DyvixCommandMenu
  overrides={{
    '--dyvix-command-menu-bg': '#0b0b0f',
    '--dyvix-command-menu-color': '#e4e4e7',
    '--dyvix-command-menu-border-color': '#27272a',
    '--dyvix-command-menu-border-radius': '8px',
    '--dyvix-command-menu-font-family': 'monospace',
    '--dyvix-command-menu-width': '600px',
    '--dyvix-command-menu-height': '320px',
    '--dyvix-command-menu-container-bg': '#0b0b0f',
    '--dyvix-command-menu-header-bg': '#141417',
    '--dyvix-command-menu-header-color': '#a1a1aa'
  }}
  headerText="Console"
/>
```

## Available Overrides

### Base

- `--dyvix-command-menu-color`: `color || string`
- `--dyvix-command-menu-letter-spacing`: `-0.02em || -0.01em || 0em || string`
- `--dyvix-command-menu-border-width`: `0px || 1px || 2px || string`
- `--dyvix-command-menu-border-style`: `solid || dashed || dotted || double || none || string`
- `--dyvix-command-menu-border-radius`: `0px || 4px || 6px || 8px || 9999px || string`
- `--dyvix-command-menu-transition`: `string || none`
- `--dyvix-command-menu-hover-color`: `color || string`
- `--dyvix-command-menu-hover-transform`: `none || translateY(-1px) || scale(1.02) || string`
- `--dyvix-command-menu-hover-border-width`: `0px || 1px || 2px || string`
- `--dyvix-command-menu-hover-border-style`: `solid || dashed || string || none`
- `--dyvix-command-menu-hover-border-radius`: `0px || 4px || 6px || 8px || 9999px || string`

### Default

- `--dyvix-command-menu-bg`: `color || transparent || string`
- `--dyvix-command-menu-font-family`: `Geist || system-ui || monospace || string`
- `--dyvix-command-menu-font-size`: `0.875rem || 0.9rem || 1rem || 1.125rem || string`
- `--dyvix-command-menu-font-weight`: `400 || 500 || 600 || 700 || string`
- `--dyvix-command-menu-border-color`: `color || transparent`
- `--dyvix-command-menu-box-shadow`: `none || inset 0 1px 0 0 rgba(255, 255, 255, 0.05) || string`
- `--dyvix-command-menu-hover-bg`: `color || transparent || string`
- `--dyvix-command-menu-hover-border-color`: `color || transparent`
- `--dyvix-command-menu-hover-box-shadow`: `none || 0 4px 12px rgba(0, 0, 0, 0.5) || string`

### Wrapper

- `--dyvix-command-menu-width`: `fit-content || 100% || auto || string`
- `--dyvix-command-menu-height`: `fit-content || 100% || auto || string`
- `--dyvix-command-menu-display`: `inline-block || block || inline-flex || flex || inline || grid || none || string`
- `--dyvix-command-menu-position`: `sticky || relative || absolute || fixed || static || string`
- `--dyvix-command-menu-top`: `1rem || fit-content || 100% || auto || string`
- `--dyvix-command-menu-z-index`: `1000 || none || number`

### Container

The container is the scrollable area that holds the console output.

- `--dyvix-command-menu-container-bg`: `color || string`
- `--dyvix-command-menu-container-webkit-scrollbar-thumb-bg`: `color || string`
- `--dyvix-command-menu-container-webkit-scrollbar-thumb-hover-bg`: `color || string`

### Header

- `--dyvix-command-menu-header-color`: `#a1a1aa || color || string`
- `--dyvix-command-menu-header-bg`: `#141417 || transparent || string`
- `--dyvix-command-menu-header-font-size`: `12px || 0.75rem || string`
- `--dyvix-command-menu-header-font-weight`: `600 || 500 || 700 || string`
- `--dyvix-command-menu-header-letter-spacing`: `0.5px || normal || string`
- `--dyvix-command-menu-header-border-bottom`: `none || 1px solid rgba(255, 255, 255, 0.1) || string`
