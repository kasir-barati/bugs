import nxFlatBase from '@nx/eslint-plugin/src/flat-configs/base.js';
import nxFlatJavaScript from '@nx/eslint-plugin/src/flat-configs/javascript.js';
import nxFlatTypeScript from '@nx/eslint-plugin/src/flat-configs/typescript.js';

export default [
  ...nxFlatBase,
  ...nxFlatTypeScript,
  ...nxFlatJavaScript,
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
];
