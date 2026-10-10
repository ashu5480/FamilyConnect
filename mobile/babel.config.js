module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // NOTE: babel-preset-expo (SDK 54+) automatically adds the
    // react-native-reanimated / worklets babel plugin when the package is
    // installed. Adding it here as well causes a "Duplicate plugin" error.
  };
};