import DefaultTheme from 'vitepress/theme';
import ButtonPlayground from './components/button/ButtonPlayground.vue';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('ButtonPlayground', ButtonPlayground);
  }
}