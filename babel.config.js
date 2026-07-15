module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Some gluestack-ui deps (react-stately/react-aria) use static class
      // blocks, which SDK 50's Babel preset does not transform by default.
      '@babel/plugin-transform-class-static-block',
      // react-native-reanimated/plugin must be listed last.
      'react-native-reanimated/plugin',
    ],
  };
};
