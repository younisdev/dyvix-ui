import { defineConfig } from 'tsup';
import type { Plugin } from 'esbuild';
import fs from 'fs/promises';
import path from 'path';

const rawLoaderPlugin: Plugin = {
  name: 'raw-loader',
  setup(build) {
    build.onResolve({ filter: /\?raw$/ }, (args) => {
      return {
        path: path.isAbsolute(args.path)
          ? args.path
          : path.join(args.resolveDir, args.path),
        namespace: 'raw-loader'
      };
    });

    build.onLoad({ filter: /.*/, namespace: 'raw-loader' }, async (args) => {
      const realPath = args.path.replace(/\?raw$/, '');
      const contents = await fs.readFile(realPath, 'utf8');
      return { contents, loader: 'text' };
    });
  }
};
export default defineConfig({
  entry: {
    index: 'src/index.jsx',
    modal: 'src/components/modal/modal.jsx',
    select: 'src/components/select/SelectCompiler.jsx',
    button: 'src/components/button/button.jsx',
    file: 'src/components/file/file.jsx',
    input: 'src/components/input/input.jsx',
    label: 'src/components/label/label.jsx',
    table: 'src/components/table/table.jsx',
    navigation: 'src/components/nav/navigation.tsx',
    toast: 'src/components/toast/toastContainer.jsx'
  },
  format: ['esm'],
  injectStyle: true,
  dts: true,
  splitting: true,
  treeshake: true,
  external: [
    'react',
    'react-dom',
    'gsap',
    '@gsap/react',
    'sugar-high',
    'idb-keyval'
  ],
  minify: true,
  sourcemap: false,
  clean: true,
  esbuildPlugins: [rawLoaderPlugin]
});
