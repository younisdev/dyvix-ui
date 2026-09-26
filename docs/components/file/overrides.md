---
title: File overrides
---

# File overrides

File style overrides represent a set of typed CSS Variables that allow easier control for the developer rather than using normal styling.

## Usage

```tsx
<DyvixFile
  onUpload={(data) => console.log(data)}
  multiple={true}
  overrides={{
    '--dyvix-file-bg': 'rgba(0, 255, 102, 0.05)',
    '--dyvix-file-color': '#00ff66',
    '--dyvix-file-border-color': 'rgba(0, 255, 102, 0.35)',
    '--dyvix-file-border-radius': '8px',
    '--dyvix-file-hover-bg': 'rgba(0, 255, 102, 0.12)',
    '--dyvix-file-hover-border-color': '#00ff66'
  }}
/>
```

## Available Overrides

- `--dyvix-file-padding`: `8px 16px || 10px 22px || 12px 24px || string`
- `--dyvix-file-color`: `color || string`
- `--dyvix-file-letter-spacing`: `-0.02em || -0.01em || 0em || string`
- `--dyvix-file-border-width`: `0px || 1px || 2px || string`
- `--dyvix-file-border-style`: `solid || dashed || dotted || double || none || string`
- `--dyvix-file-border-radius`: `0px || 4px || 6px || 8px || 9999px || string`
- `--dyvix-file-transition`: `string || none`
- `--dyvix-file-hover-color`: `color || string`
- `--dyvix-file-hover-transform`: `none || translateY(-1px) || scale(1.02) || string`
- `--dyvix-file-hover-border-width`: `0px || 1px || 2px || string`
- `--dyvix-file-hover-border-style`: `solid || dashed || string || none`
- `--dyvix-file-hover-border-radius`: `0px || 4px || 6px || 8px || 9999px || string`
- `--dyvix-file-bg`: `color || transparent || string`
- `--dyvix-file-font-family`: `Geist || system-ui || monospace || string`
- `--dyvix-file-font-size`: `0.875rem || 0.9rem || 1rem || 1.125rem || string`
- `--dyvix-file-font-weight`: `400 || 500 || 600 || 700 || string`
- `--dyvix-file-border-color`: `color || transparent`
- `--dyvix-file-box-shadow`: `none || inset 0 1px 0 0 rgba(255, 255, 255, 0.05) || string`
- `--dyvix-file-hover-bg`: `color || transparent || string`
- `--dyvix-file-hover-border-color`: `color || transparent`
- `--dyvix-file-hover-box-shadow`: `none || 0 4px 12px rgba(0, 0, 0, 0.5) || string`
- `--dyvix-file-width`: `fit-content || 100% || auto || string`
- `--dyvix-file-height`: `fit-content || 100% || auto || string`
