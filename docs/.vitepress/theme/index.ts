import DefaultTheme from 'vitepress/theme';
import ButtonPlayground from './components/button/ButtonPlayground.vue';
import FilePlayground from './components/file/FilePlayground.vue';
import InputPlayground from './components/input/InputPlayground.vue';
import ModalPlayground from './components/modal/ModalPlayground.vue';
import SelectPlayground from './components/select/SelectPlayground.vue';
import LabelPlayground from './components/label/LabelPlayground.vue';
import ToastPlayground from './components/toast/ToastPlayground.vue';
import './custom.css';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('ButtonPlayground', ButtonPlayground);
    app.component('FilePlayground', FilePlayground);
    app.component('InputPlayground', InputPlayground);
    app.component('ModalPlayground', ModalPlayground);
    app.component('SelectPlayground', SelectPlayground);
    app.component('LabelPlayground', LabelPlayground);
    app.component('ToastPlayground', ToastPlayground);
  }
};
