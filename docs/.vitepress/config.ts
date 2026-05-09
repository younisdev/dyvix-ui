import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Dyvix UI',
  description: 'Beautiful by default, customizable by design.',
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    [
      'meta',
      { property: 'og:image', content: 'https://dyvix-ui.vercel.app/logo.png' }
    ],
    ['meta', { property: 'og:title', content: 'Dyvix UI' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Beautiful by default, customizable by design.'
      }
    ]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Components', link: '/components/modal/modal' },
      { text: 'GitHub', link: 'https://github.com/younisdev/dyvix-ui/' }
    ],
    logo: '/logo.png',
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: 'guide/introduction' },
          { text: 'Quickstart', link: 'guide/quickstart' }
        ]
      },
      {
        text: 'Components',
        items: [
          {
            text: 'Modal',
            collapsed: false,
            items: [
              { text: 'Overview', link: 'components/modal/modal' },
              { text: 'Elements', link: 'components/modal/elements' },
              { text: 'Validations', link: 'components/modal/validation' },
              { text: 'Presets', link: 'components/modal/presets' }
            ]
          },
          { text: 'Select', link: 'components/select/select' },
          { text: 'Toast', link: 'components/toast/toast' },
          { text: 'Button', link: 'components/button/button' },
          { text: 'File', link: 'components/file/file' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/younisdev/dyvix-ui/' }
    ],
    editLink: {
      pattern: 'https://github.com/younisdev/dyvix-ui/edit/main/docs/:path'
    },
    outline: {
      level: 'deep',
      label: 'On this page'
    }
  }
});
