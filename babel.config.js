module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Some gluestack-ui deps (react-stately/react-aria) use static class
      // blocks, which SDK 50's Babel preset does not transform by default.
      '@babel/plugin-transform-class-static-block',
      // reanimated 4 moved its Babel plugin to react-native-worklets; must be last.
      'react-native-worklets/plugin',
    ],
  };
};
