import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env, argv) => {
  const isProduction = argv.mode === 'production';
const commonModule = {
  rules: [
    {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'ts-loader',
      }
    }
  ]
};

return [
    {
      name: 'client',
      entry: [
       './client/startClient.ts'
      ],
      mode: isProduction ? 'production' : 'development',
      target: ['web', 'es2020'],
      output: {
        filename: 'client.js',
        path: path.resolve(__dirname, 'dist/client'),
        clean: true,
        module: true,
      },
      experiments: {
        outputModule: true
      },
      resolve: {
        extensions: ['.tsx', '.ts', '.js'],

        alias: {
          '@shared': path.resolve(__dirname, 'shared')
        }

      },
      externalsType: 'module',
      externals: {
        'alt-client': 'alt-client',
        'natives': 'natives',
        'alt-shared': 'alt-shared'
      },
      module: commonModule,
      optimization: {
        minimize: isProduction,
        splitChunks: false
      },
     devtool: false
    },

    {
      name: 'server',
      entry: [        
        './server/startServer.ts',
      ],
      mode: isProduction ? 'production' : 'development',
      target: 'node16',
      output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'dist/server'),
        clean: true,
        module: true,
        library: { type: 'module' }
      },
      experiments: {
        outputModule: true
      },
      resolve: {
        extensions: ['.tsx', '.ts', '.js'],

        alias: {
          '@shared': path.resolve(__dirname, 'shared')
        }

      },
      externalsType: 'module',
      externals: {
        'alt-server': 'alt-server',
        'alt:chat' : 'alt:chat',
      },
      module: commonModule,
      optimization: {
        minimize: isProduction
      },
      devtool: false
    }
  ];
};