---
title: Dyvix Command Menu
---

# Dyvix Command Menu

DyvixCommandMenu is an animated console that monitors application output and runs built-in or custom commands. It supports themed rendering, CSS variable overrides, and dragging by the header with the mouse.

## Attributes

- `commands`
  - : `DyvixCommand[]`. Adds custom commands alongside the built-in commands. No custom commands are provided by default. Commands are matched by name or alias, with built-in commands checked first.
- `autoScroll`
  - : `boolean`. Defaults to `true`. Scrolls to the latest output when logs change.
- `showOnRender`
  - : `boolean`. Defaults to `true`. Controls whether the menu is shown initially.
- `headerText`
  - : `string`. Sets the header label. Displays `Console` when omitted.
- `welcomeMessage`
  - : `string | string[] | null`. Sets the initial output. Defaults to `['Welcome to Dyvix UI Console', 'Type "help" to see available commands.']`. Use `null` or an empty array to start without welcome messages. Changes after mounting do not replace the initial output.
- `triggerKey`
  - : `string`. Defaults to the backtick key (`` ` ``). Toggles the menu when its command input is not focused. Key matching is case-insensitive.
- `overrides`
  - : `DyvixCommandMenuProps['overrides']`. An object of typed CSS variables applied to the wrapper. Supports base, default, wrapper, container, and header overrides, such as `--dyvix-command-menu-color`, `--dyvix-command-menu-bg`, `--dyvix-command-menu-width`, `--dyvix-command-menu-container-bg`, and `--dyvix-command-menu-header-color`.
- `theme`
  - : `'Singularity' | null`. Selects a theme. Supports `Singularity`. Omit this prop or pass `null` to use the default styles; no theme is selected by default.
- `animation`
  - : `DyvixCommandMenuAnimation | null`. Controls the entrance and exit animation. Defaults to `fade`. Supports `fade`, `bubble`, `zoom`, `unfold`, `glitch`, `pulse`, `aurora`, `drop`, `flip`, `glide`, `drift`, `float`, `swing`, `slideRight`, `spiral`, and `bounce`. Use `null` to disable preset animation.
- `className`
  - : `string`. Adds a custom class to the inner menu element.
- `style`
  - : `React.CSSProperties`. Inline styles split between the wrapper and inner menu element by the component's layout style handling.
- `timeline`
  - : `gsap.core.Timeline | null`. An external `gsap.timeline()` instance to which the component adds its entrance and exit animations. No timeline is provided by default.

The component also accepts standard `HTMLAttributes<HTMLDivElement>` and forwards a ref to its wrapper `HTMLDivElement`.

## Command Types

`DyvixCommand`, `CommandContext`, `CommandResult`, `DyvixLog`, `LogType`, and `DyvixCommandMenuProps` can be imported as types from `dyvix-ui`.

A `DyvixCommand` defines a custom command:

- `name`
  - : `string`. Required command name. Matching is case-sensitive.
- `description`
  - : `string`. Required description displayed by `help`.
- `usage`
  - : `string`. Optional usage text displayed by `help`.
- `aliases`
  - : `string[]`. Optional alternative names for the command.
- `execute`
  - : `(args: string[], context: CommandContext) => CommandResult | Promise<CommandResult>`. Runs the command. `CommandResult` is `void | string`; a returned string, including a resolved promise value, is printed as a log. Thrown errors and rejected promises are printed as command errors.

`CommandContext` provides access to the console:

- `clearLogs`
  - : `() => void`. Clears displayed logs.
- `printOutput`
  - : `(message: string, type?: LogType) => void`. Prints output with an optional type. Defaults to `Log`.
- `commands`
  - : `readonly DyvixCommand[]`. Contains the built-in and custom commands.

`LogType` is `'Error' | 'Warning' | 'Log'`. A `DyvixLog` contains `id: string`, `type: LogType`, `text: any`, and `timestamp: string | null`. Welcome messages have no timestamp; subsequent output uses the local time.

## Console Commands

Type a command and press Enter to run it. Input is trimmed and split on whitespace into a command name and its arguments.

- `help` / `?`
  - : Lists all built-in and custom commands with their descriptions, aliases, and usage text where provided.
- `clear`
  - : Clears displayed logs and pending buffered output.
- `echo [message]`
  - : Prints the arguments joined by spaces. Prints a usage warning when no message is provided.
- `time`
  - : Prints the current local system time.

While mounted, the component intercepts `console.log`, `console.warn`, and `console.error`, displaying their output while preserving the original browser console calls. It also listens for uncaught errors through the window's `error` event and unhandled promise rejections through `unhandledrejection`. Monitoring continues while the menu is hidden. On unmount, the original console methods are restored and these event listeners are removed.

## Example

```tsx
import { DyvixCommandMenu } from 'dyvix-ui';

function CommandMenuExample() {
  return (
    <DyvixCommandMenu
      commands={[
        {
          name: 'example',
          description: 'Tests dyvix commands custom command',
          usage: 'example',
          aliases: ['ex', '!'],
          execute: (_, context) => {
            context.printOutput(`Test`, 'Log');
          }
        }
      ]}
      autoScroll
      showOnRender
      headerText="Test"
      welcomeMessage={[
        'Welcome to Dyvix UI Console',
        'Type "help" to see available commands.'
      ]}
      triggerKey="`"
    />
  );
}
```
