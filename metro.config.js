const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json', 'cjs'],
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'mp4', 'mp3', 'svg'],
    extraNodeModules: new Proxy({}, {
      get: (target, name) => {
        return path.join(__dirname, `node_modules/${name}`);
      },
    }),
    resolverMainFields: ['react-native', 'browser', 'main'],
    blockList: [/node_modules\/.*\/node_modules\/react-native\/.*/],
  },
  maxWorkers: 2,
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  watchFolders: [
    path.resolve(__dirname, 'node_modules'),
  ],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
