module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // Unistyles 3 rewrites the style sheets and components under app/ at build time
    plugins: [["react-native-unistyles/plugin", { root: "app" }]],
  };
};
