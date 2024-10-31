import nxFlatReactBase from '@nx/eslint-plugin/src/flat-configs/react-base.js';
import nxFlatReactJsx from '@nx/eslint-plugin/src/flat-configs/react-jsx.js';
import nxFlatReactTmp from '@nx/eslint-plugin/src/flat-configs/react-tmp.js';
import nxFlatReactTypescript from '@nx/eslint-plugin/src/flat-configs/react-typescript.js';
import baseConfig from '../../eslint.config.ts';

module.exports = [
  ...baseConfig,
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
  ...nxFlatReactJsx,
  ...nxFlatReactTmp,
  ...nxFlatReactBase,
  ...nxFlatReactTypescript,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
];
