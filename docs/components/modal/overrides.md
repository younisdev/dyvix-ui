---
title: Modal overrides
---

# Modal overrides

Modal style overrides represent a set of typed CSS Variables that allow easier control for the developer rather than using normal styling.

## Usage

```tsx
<DyvixModal
  title="Register"
  overrides={{
    '--dyvix-modal-bg': '#0f172a',
    '--dyvix-modal-color': '#f8fafc',
    '--dyvix-modal-border-color': '#334155',
    '--dyvix-modal-border-radius': '8px',
    '--dyvix-modal-backdrop-filter': 'blur(12px)',
    '--dyvix-modal-header-color': '#f8fafc',
    '--dyvix-modal-button-bg': '#2563eb',
    '--dyvix-modal-button-hover-bg': '#3b82f6',
    '--dyvix-modal-button-color': '#ffffff'
  }}
  elements={[
    {
      type: 'text',
      name: 'fullName',
      placeholder: 'Full Name',
      amount: 1
    },
    {
      type: 'radio',
      name: 'plan',
      placeholder: 'Choose a plan',
      options: ['Free', 'Pro', 'Enterprise'],
      amount: 1
    }
  ]}
/>
```

## Available Overrides

- `--dyvix-modal-backdrop-filter`: `blur(0px) || blur(4px) || blur(8px) || none || string`
- `--dyvix-modal-padding`: `8px 16px || 10px 22px || 12px 24px || string`
- `--dyvix-modal-color`: `color || string`
- `--dyvix-modal-letter-spacing`: `-0.02em || -0.01em || 0em || string`
- `--dyvix-modal-border-width`: `0px || 1px || 2px || string`
- `--dyvix-modal-border-style`: `solid || dashed || dotted || double || none || string`
- `--dyvix-modal-border-radius`: `0px || 4px || 6px || 8px || 9999px || string`
- `--dyvix-modal-transition`: `string || none`
- `--dyvix-modal-hover-color`: `color || string`
- `--dyvix-modal-hover-transform`: `none || translateY(-1px) || scale(1.02) || string`
- `--dyvix-modal-hover-border-width`: `0px || 1px || 2px || string`
- `--dyvix-modal-hover-border-style`: `solid || dashed || string || none`
- `--dyvix-modal-hover-border-radius`: `0px || 4px || 6px || 8px || 9999px || string`
- `--dyvix-modal-bg`: `color || transparent || string`
- `--dyvix-modal-font-family`: `Geist || system-ui || monospace || string`
- `--dyvix-modal-font-size`: `0.875rem || 0.9rem || 1rem || 1.125rem || string`
- `--dyvix-modal-font-weight`: `400 || 500 || 600 || 700 || string`
- `--dyvix-modal-border-color`: `color || transparent`
- `--dyvix-modal-box-shadow`: `none || inset 0 1px 0 0 rgba(255, 255, 255, 0.05) || string`
- `--dyvix-modal-hover-bg`: `color || transparent || string`
- `--dyvix-modal-hover-border-color`: `color || transparent`
- `--dyvix-modal-hover-box-shadow`: `none || 0 4px 12px rgba(0, 0, 0, 0.5) || string`
- `--dyvix-modal-header-font-family`: `Geist || system-ui || monospace || string`
- `--dyvix-modal-header-font-size`: `0.875rem || 0.9rem || 1rem || 1.125rem || string`
- `--dyvix-modal-header-font-weight`: `400 || 500 || 600 || 700 || string`
- `--dyvix-modal-header-color`: `color || string`
- `--dyvix-modal-header-transition`: `string || none`
- `--dyvix-modal-header-hover-color`: `color || string`
- `--dyvix-modal-header-hover-transform`: `none || translateY(-1px) || scale(1.02) || string`
- `--dyvix-modal-button-font-family`: `Geist || system-ui || monospace || string`
- `--dyvix-modal-button-font-size`: `0.875rem || 0.9rem || 1rem || 1.125rem || string`
- `--dyvix-modal-button-font-weight`: `400 || 500 || 600 || 700 || string`
- `--dyvix-modal-button-bg`: `color || string`
- `--dyvix-modal-button-color`: `color || string`
- `--dyvix-modal-button-transition`: `string || none`
- `--dyvix-modal-button-hover-color`: `color || string`
- `--dyvix-modal-button-hover-bg`: `color || string`
- `--dyvix-modal-button-hover-transform`: `none || translateY(-1px) || scale(1.02) || string`
- `--dyvix-modal-button-active-color`: `color || string`
- `--dyvix-modal-button-active-bg`: `color || string`
- `--dyvix-modal-button-active-transform`: `none || translateY(-1px) || scale(1.02) || string`
- `--dyvix-modal-z-index`: `1000 || 9999 || number || string`
- `--dyvix-modal-display`: `flex || grid || string`
