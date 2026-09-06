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
    index: 'src/index.tsx',
    modal: 'src/components/modal/modal.tsx',
    select: 'src/components/select/SelectCompiler.tsx',
    button: 'src/components/button/button.tsx',
    file: 'src/components/file/file.tsx',
    input: 'src/components/input/input.tsx',
    label: 'src/components/label/label.tsx',
    table: 'src/components/table/table.tsx',
    navigation: 'src/components/nav/navigation.tsx',
    toast: 'src/components/toast/toastContainer.tsx',
    marquee: 'src/components/marquee/marquee.tsx'
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
