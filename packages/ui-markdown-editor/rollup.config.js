import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import filesize from 'rollup-plugin-filesize';
import includePaths from 'rollup-plugin-includepaths';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import autoprefixer from 'autoprefixer';
import stylelint from 'rollup-plugin-stylelint';
import postcssPresetEnv from 'postcss-preset-env';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const outputs = [
  {
    file: process.env.REACT_APP_PKG_MAIN || pkg.main,
    format: 'umd',
  },
  {
    file: process.env.REACT_APP_PKG_MODULE || pkg.module,
    format: 'es',
  },
];

const postcssPlugins = [
  postcssPresetEnv({
    browsers: pkg.browserslist.production,
    stage: 3,
  }),
  autoprefixer(),
];

const config = outputs.map(({ file, format }) => ({
  input: 'src/lib/index.js',
  output: {
    file,
    format,
    name: 'MarkdownEditor',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      'prop-types': 'PropTypes',
      '@accordproject/markdown-cicero': 'markdownCicero',
      'styled-components': 'styled',
      slate: 'slate',
      'slate-react': 'slateReact',
      'slate-history': 'slateHistory',
      'is-hotkey': 'isHotKey',
      '@accordproject/markdown-slate': 'markdownSlate',
      '@accordproject/markdown-html': 'markdownHtml',
      'image-extensions': 'imageExtension',
      'semantic-ui-react': 'semanticUiReact'
    },
    exports: 'named',
  },
  plugins: [
    peerDepsExternal(),
    includePaths({
      include: {},
      paths: ['src'],
      external: Object.keys(pkg.dependencies),
      extensions: ['.js', '.json', '.html'],
    }),
    stylelint({
      throwOnError: true,
    }),
    postcss({
      extract: process.env.REACT_APP_PKG_STYLE || pkg.style,
      inline: false,
      plugins: postcssPlugins,
    }),
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      configFile: './babel.config.rollup.js',
    }),
    resolve({
      browser: true,
    }),
    commonjs(),
    terser(),
    filesize(),
  ],
  external: ['@babel/runtime']
}));

export default config;
