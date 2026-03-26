import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Dyvix UI",
  description: "Beautiful by default, customizable by design.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Introduction', link: 'guide/introduction' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Introduction', link: 'guide/introduction' },
          { text: 'Quickstart', link: 'guide/quickstart' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/younisdev/dyvix-ui/' }
    ]
  }
})
