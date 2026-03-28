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
5. Commit and push your changes.
6. Open a pull request.

## Ways you can help

### Add a Theme

Themes are defined in `src/components/modal/dependencies/themes.json` and styled in `src/components/modal/dependencies/style/themes.css`.

1. Add a unique theme entry in [themes.json](https://github.com/younisdev/dyvix-ui/blob/main/src/components/modal/dependencies/themes.json) file referencing the css class of the new theme.
2. Add your CSS class in  [themes.css](https://github.com/younisdev/dyvix-ui/blob/main/components/src/modal/dependencies/style/themes.css).

### Add an Animation

Animations are defined in `src/components/animations.json`.

1. Create an entry into [animations.json](https://github.com/younisdev/dyvix-ui/blob/main/src/components/animations.json).

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
4. Reference the related issue if it fixes an existing issue

## Project Structure

```bash
src/
  components/
    modal/         # Modal component
    select/        # Select engine
  static/          # Assets
docs/              # Dyvix documentation
```
