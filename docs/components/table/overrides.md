---
title: Table overrides
---

# Table overrides

Table style overrides represent a set of typed CSS Variables that allow easier control for the developer rather than using normal styling.

## Usage

```tsx
<DyvixTable
  overrides={{
    '--dyvix-table-width': '100%',
    '--dyvix-table-bg': '#0f172a',
    '--dyvix-table-border-color': '#1e293b',
    '--dyvix-table-border-radius': '8px',
    '--dyvix-table-header-bg': '#1e293b',
    '--dyvix-table-header-color': '#f8fafc',
    '--dyvix-table-body-color': '#94a3b8',
    '--dyvix-table-body-hover-bg': '#1e293b',
    '--dyvix-table-body-hover-color': '#ffffff'
  }}
  animation={'aurora'}
  columns={[
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true }
  ]}
  data={[{ id: 2, name: 'Lion' }]}
/>
```

## Available Overrides

- `--dyvix-table-text-align`: `left || right || string`,
- `--dyvix-table-color`: `color || string`,
- `--dyvix-table-letter-spacing`: `-0.02em || -0.01em || 0em || string`,
- `--dyvix-table-border-width`: `0px || 1px || 2px || string`,
- `--dyvix-table-border-style`: `solid || dashed || dotted || double || none || string`,
- `--dyvix-table-border-radius`: `0px || 4px || 6px || 8px || 9999px || string`,
- `--dyvix-table-transition`: `string || none`,
- `--dyvix-table-hover-color`: `color || string`,
- `--dyvix-table-hover-transform`: `none || translateY(-1px) || scale(1.02) || string`,
- `--dyvix-table-hover-border-width`: `0px || 1px || 2px || string`,
- `--dyvix-table-hover-border-style`: `solid || dashed || string || none`,
- `--dyvix-table-hover-border-radius`: `0px || 4px || 6px || 8px || 9999px || string`
- `--dyvix-table-bg`: `color || transparent || string`,
- `--dyvix-table-font-family`: `Geist || system-ui || monospace || string`,
- `--dyvix-table-font-size`: `0.875rem || 0.9rem || 1rem || 1.125rem || string`,
- `--dyvix-table-font-weight`: `400 || 500 || 600 || 700 || string`,
- `--dyvix-table-border-color`: `color || transparent`,
- `--dyvix-table-box-shadow`: `none || inset 0 1px 0 0 rgba(255, 255, 255, 0.05) || string`,
- `--dyvix-table-hover-bg`: `color || transparent || string`,
- `--dyvix-table-hover-border-color`: `color || transparent`,
- `--dyvix-table-hover-box-shadow`: `none || 0 4px 12px rgba(0, 0, 0, 0.5) || string`
- `--dyvix-table-width`: `fit-content || 100% || auto || string`,
- `--dyvix-table-margin`: `0.3rem auto || 0 || string`,
- `--dyvix-table-height`: `fit-content || 100% || auto || string`,
- `--dyvix-table-display`: `inline-block || block || inline-flex || flex || inline || grid || none || table || string`
- `--dyvix-table-header-bg`: `color || transparent || string`,
- `--dyvix-table-header-hover-bg`: `color || transparent || string`,
- `--dyvix-table-header-color`: `color || transparent || string`,
- `--dyvix-table-header-hover-color`: `color || transparent || string`
- `--dyvix-table-body-bg`: `color || transparent || string`,
- `--dyvix-table-body-hover-bg`: `color || transparent || string`,
- `--dyvix-table-body-color`: `color || transparent || string`,
- `--dyvix-table-body-hover-color`: `color || transparent || string`
