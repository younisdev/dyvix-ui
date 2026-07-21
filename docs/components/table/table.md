---
title: Dyvix Table
next:
  text: 'Navigation Component'
  link: 'components/nav/nav'
---

# Dyvix Table

DyvixTable is an animated, headless table engine that supports both themed and unstyled rendering modes. It supports two usage patterns:

- **Config-driven mode** for rendering tables from structured data.
- **Composable mode** for building fully custom table layouts using sub-components.

## Attributes

- `columns`
  - : `Array<{key: string, label: string}>`. Defines the table's column structure for config-driven mode. Each object requires a unique `key` matching the corresponding data property, and a `label` for display.
- `data`
  - : `Array<Object>`. Row data for config-driven mode. Each object's keys must match the `key` values defined in `columns`.
- `children`
  - : `ReactNode`. Used in composable mode to manually build the table using `DyvixTableHeader`, `DyvixTableBody`, `DyvixTableRow`, `DyvixTableHead`, and `DyvixTableCell`.
- `theme`
  - : `string`. Controls the design and feel of the table. See the [Themes list](/guide/themes) for a full list.
- `animation`
  - : `string`. Controls the entrance animation of the table. Defaults to `fade`. See the [Animation List](/guide/animations) for a full list.
- `background`
  - : `string`. Controls the table's background color.
- `color`
  - : `string`. Controls the table's text color.
- `className`
  - : `string`. Contains a custom class for your table, allowing more control for the developer.
- `style`
  - : `Object`. Inline style overrides applied to the table.

## Sub-components

Used exclusively in composable mode:

- `DyvixTableHeader`
  - : Wraps the table's header rows. Renders as `<thead>`.
- `DyvixTableBody`
  - : Wraps the table's body rows. Renders as `<tbody>`.
- `DyvixTableRow`
  - : Represents a single row. Renders as `<tr>`.
- `DyvixTableHead`
  - : Represents a header cell. Renders as `<th>`.
- `DyvixTableCell`
  - : Represents a body cell. Renders as `<td>`.

## Example

### Config-driven mode

```jsx
import { DyvixTable } from 'dyvix-ui';

function TableExample() {
  return (
    <DyvixTable
      theme="Crimson"
      animation="drift"
      columns={[
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'type', label: 'Type' }
      ]}
      data={[
        { id: 1, name: 'Lion', type: 'Wild' },
        { id: 2, name: 'Wolf', type: 'Wild' }
      ]}
    />
  );
}
```

### Composable mode

```jsx
import {
  DyvixTable,
  DyvixTableHeader,
  DyvixTableBody,
  DyvixTableRow,
  DyvixTableHead,
  DyvixTableCell
} from 'dyvix-ui';

function TableExample() {
  return (
    <DyvixTable theme="Crimson">
      <DyvixTableHeader>
        <DyvixTableRow>
          <DyvixTableHead>ID</DyvixTableHead>
          <DyvixTableHead>Name</DyvixTableHead>
          <DyvixTableHead>Type</DyvixTableHead>
        </DyvixTableRow>
      </DyvixTableHeader>
      <DyvixTableBody>
        <DyvixTableRow>
          <DyvixTableCell>1</DyvixTableCell>
          <DyvixTableCell>Lion</DyvixTableCell>
          <DyvixTableCell>Wild</DyvixTableCell>
        </DyvixTableRow>
        <DyvixTableRow>
          <DyvixTableCell>2</DyvixTableCell>
          <DyvixTableCell>Wolf</DyvixTableCell>
          <DyvixTableCell>Wild</DyvixTableCell>
        </DyvixTableRow>
      </DyvixTableBody>
    </DyvixTable>
  );
}
```
