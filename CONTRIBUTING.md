# Contributing to Dyvix UI

Thank you for your interest in contributing! Dyvix is **config-driven** library which means most contributors won't need deep understanding of Dyvix UI codebase.

## Getting Started

1. Fork the repository.
2. Clone your newly forked repository:

   ```bash
   git clone https://github.com/YOUR_USERNAME/dyvix-ui/
   cd dyvix-ui
   npm install
   ```

3. Create a branch:

   ```bash
   git checkout -b your-feature-name
   ```

4. Make your Changes.
5. Run the Dyvix automated engine:

   ```bash
   npm run dyvix:build
   ```

6. Commit and push your changes.
7. Open a pull request.

## Ways you can help

### Add a Theme

Themes are defined in `src/components/modal/dependencies/themes.json` and styled in `src/components/modal/dependencies/style/themes.css`.

1. Add a unique theme entry in [themes.json](https://github.com/younisdev/dyvix-ui/blob/main/src/components/modal/dependencies/themes.json) file referencing the css class of the new theme.
2. Add your CSS class in [themes.css](https://github.com/younisdev/dyvix-ui/blob/main/src/components/modal/dependencies/style/themes.css).
3. Run the Dyvix automated engine:

   ```bash
   npm run dyvix:build
   ```

### Add an Animation

Animations are defined in `src/registry/animations.json`.

1. Create an entry into [animations.json](https://github.com/younisdev/dyvix-ui/blob/main/src/registry/animations.json).
2. Run the Dyvix automated engine:

   ```bash
   npm run dyvix:build
   ```

### Report a Bug

Open an issue with:

- What happened
- What you expected
- Steps to reproduce

### Suggest a Feature or a component

1. Open an issue describing what you want and why.
2. Wait for confirmation.
3. Make a pull request.

### Improve documentation

- Fix typos.
- Add a new page.
- Improve tone.

## Guidelines

1. Treat the community with respect.
2. Follow existing code style.
3. Test your changes before making a pr.
4. Reference the related issue if it fixes an existing issue.
5. Avoid opening more than 3-4 PRs at a time unless they are small and focused. Wait for a review before opening additional PRs, a large number of concurrent PRs makes review difficult and slows down maintenance for everyone.
6. Respect PR assignments. First to comment or open a PR gets priority.

## Project Structure

```bash
src/
  components/       # UI components
    button/         # Button component
    file/           # File component
    input/          # Input component
    label/          # Label component
    modal/          # Modal component
    select/         # Select engine
    table/          # Table component
    toast/          # Toast component
    animations.json # Animation definitions
  themeRegistry/    # Theme definitions (themes.json)
  utils/            # Shared utilities & SJC
  static/           # Assets (logo, demo media)
  constants.js      # Shared constants
  index.jsx         # Package entry point
docs/               # VitePress documentation site
dev-engine/         # Automated dev/build engine
devbench/           # Dev bench tooling
```
