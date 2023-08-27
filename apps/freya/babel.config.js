module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Required for expo-router
      "expo-router/babel",
      "transform-inline-environment-variables",
      [
        "ttag",
        {
          extract: {
            output: "i18n/en.pot",
          },
          moduleName: "@mjord/common",
        },
      ],
      // has to be last on the list as per docs https://docs.expo.dev/develop/user-interface/animation/
      "react-native-reanimated/plugin",
    ],
  };
};
