---
title: Nav overrides
---

# Nav overrides

Nav style overrides represent a set of typed CSS Variables that allow easier control for the developer rather than using normal styling.

## Usage

```tsx
<DyvixNav
  overrides={{
    '--dyvix-nav-bg': 'black',
    '--dyvix-nav-border-color': '#1e293b',
    '--dyvix-nav-border-radius': '9999px',
    '--dyvix-nav-padding': '0.75rem 1.5rem',
    '--dyvix-nav-position': 'sticky',
    '--dyvix-nav-top': '1rem',
    '--dyvix-nav-z-index': 1000,
    '--dyvix-nav-brand-color': '#ffffff',
    '--dyvix-nav-link-color': '#94a3b8',
    '--dyvix-nav-link-hover-color': '#3b82f6'
  }}
  brand={{ label: 'Dyvix UI', href: '/' }}
  items={[
    { label: 'Docs', href: '/docs' },
    { label: 'Components', href: '/components' }
  ]}
  animation="bounce"
  microanimation="pulse"
/>
```

## Available Overrides

- `--dyvix-nav-display`: `inline-block || block || inline-flex || flex || inline || grid || inline-grid || contents || flow-root || list-item || table || inline-table || table-row || table-cell || none || string`
- `--dyvix-nav-gap`: `100px || 1rem || string`
- `--dyvix-nav-padding`: `1rem 2rem || 8px 16px || 10px 22px || 12px 24px || string`
- `--dyvix-nav-color`: `color || transparent`
- `--dyvix-nav-font-family`: `Geist || system-ui || monospace || string`
- `--dyvix-nav-font-size`: `0.9rem || 0.875rem || 1rem || 1.125rem || string`
- `--dyvix-nav-font-weight`: `500 || 400 || 600 || 700 || string`
- `--dyvix-nav-border-width`: `1px || 0px || 2px || string`
- `--dyvix-nav-border-style`: `solid || dashed || dotted || double || string || none`
- `--dyvix-nav-border-radius`: `2rem || 0px || 4px || 6px || 8px || 9999px || string`
- `--dyvix-nav-hover-color`: `color || transparent`
- `--dyvix-nav-hover-border-width`: `1px || 0px || 2px || string`,
- `--dyvix-nav-hover-border-style`: `solid || dashed || dotted || double || string || none`
- `--dyvix-nav-hover-border-radius`: `2rem || 0px || 4px || 6px || 8px || 9999px || string`
- `--dyvix-nav-hover-transform`: `scale(1.009) || none || translateY(1px) || scale(0.98) || string`
- `--dyvix-nav-transition`: `string || none`
- `--dyvix-nav-focus`: `color || transparent`
- `--dyvix-nav-border-color`: `color || transparent`
- `--dyvix-nav-bg`: `color || transparent`
- `--dyvix-nav-box-shadow`: `0 4px 24px rgba(0, 0, 0, 0.24) || none || inset 0 1px 0 0 rgba(255, 255, 255, 0.05) || string`
- `--dyvix-nav-hover-border-color`: `color || transparent`
- `--dyvix-nav-hover-bg`: `color || transparent`
- `--dyvix-nav-hover-box-shadow`: `0 4px 24px rgba(0, 0, 0, 0.24) || none || inset 0 1px 0 0 rgba(255, 255, 255, 0.05) || string`
- `--dyvix-nav-width`: `95vw || fit-content || 100% || auto || string`
- `--dyvix-nav-max-width`: `1200px || none || string`
- `--dyvix-nav-height`: `fit-content || 100% || auto || string`
- `--dyvix-nav-position`: `sticky || relative || absolute || fixed || static || string`
- `--dyvix-nav-top`: `1rem || fit-content || 100% || auto || string`
- `--dyvix-nav-z-index`: `1000 || none || number`
- `--dyvix-nav-margin`: `2rem auto || 0 || auto || string`
- `--dyvix-nav-menu-flex-direction`: `row || column || row-reverse || column-reverse || string`
- `--dyvix-nav-menu-align-items`: `center || flex-start || flex-end || stretch || baseline || string`
- `--dyvix-nav-menu-gap`: `50px || 1rem || 2rem || string`
- `--dyvix-nav-menu-padding`: `0 || 1rem || string`
- `--dyvix-nav-brand-color`: `color || transparent`
- `--dyvix-nav-brand-hover-color`: `color || transparent`
- `--dyvix-nav-link-color`: `color || transparent`
- `--dyvix-nav-link-hover-color`: `color || transparent`
