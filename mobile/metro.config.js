const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// NOTE: Do NOT add 'cjs' to assetExts. expo-router requires
// 'nanoid/non-secure', which resolves to a `.cjs` file. If 'cjs' is listed
// as an asset extension, Metro serves the module as a static asset (numeric
// ID) instead of JavaScript, so `require('nanoid/non-secure').nanoid` is
// undefined and crashes at startup with
// `(0, non_secure_1.nanoid) is not a function`.
// `.cjs` is already handled as source by the default config.

module.exports = config;