---
title: Modal Validation
next:
  text: 'Modal presets'
  link: 'components/modal/presets'
---

# Modal Validation Presets

Validation presets are exclusive for modal component providing `plug-and-play` validation for the developer.

## Available presets

Dyvix provides a wide range of validation presets. You can trigger these by passing the string name or the exported constant object for types safety or by using custom patterns by using pattern-embeding prefix `$R`. Moreover, you can embed a custom error message using the | separator.

- `DYVIX_MODAL_VALIDATION_PRESET.EMAIL`: `'email'`
- `DYVIX_MODAL_VALIDATION_PRESET.PASSWORD`: `'password'`
- `DYVIX_MODAL_VALIDATION_PRESET.NUMBER`: `'number'`
- `DYVIX_MODAL_VALIDATION_PRESET.URL`: `'url'`
- `DYVIX_MODAL_VALIDATION_PRESET.MANDATORY`: `mandatory`,
- `DYVIX_MODAL_VALIDATION_PRESET.DATE`: `date`
