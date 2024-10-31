import { composePlugins, withNx } from '@nx/webpack';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// get the resolved path to the file
const fileName = fileURLToPath(import.meta.url);
// get the name of the directory
const dirName = dirname(fileName);

export default composePlugins(
  withNx({
    tsConfig: join(dirName, 'tsconfig.app.json'),
    assets: [join(dirName, 'src', 'assets')],
    generatePackageJson: true,
    deleteOutputPath: true,
    outputHashing: 'none',
    optimization: false,
    main: join(dirName, 'src', 'main.ts'),
    compiler: 'tsc',
  }),
  (config) => {
    config.target = 'node';
    config.output = {
      path: join(dirName, '..', '..', 'dist', 'apps', 'nest'),
    };

    return config;
  },
);

// export const output = {
//   path: join(__dirname, '../../dist/apps/nest'),
// };
// export const plugins = [
//   new NxAppWebpackPlugin({
//     target: 'node',
//     compiler: 'tsc',
//     main: './src/main.ts',
//     tsConfig: './tsconfig.app.json',
//     assets: ['./src/assets'],
//     optimization: false,
//     outputHashing: 'none',
//     generatePackageJson: true,
//     // Will this break my cache?
//     deleteOutputPath: true,
//   }),
// ];
