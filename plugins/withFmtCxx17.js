const { withPodfile } = require("expo/config-plugins");
const { mergeContents } = require("@expo/config-plugins/build/utils/generateCode");

// The clang in Xcode 27 rejects fmt 11's consteval format strings, and fmt
// only falls back when built below C++20. It goes after react_native_post_install,
// which sets C++20 on every pod.
const POST_INSTALL_BLOCK = `    installer.pods_project.targets.each do |target|
      next unless target.name == 'fmt'
      target.build_configurations.each do |config|
        config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
      end
    end
`;

module.exports = (config) =>
  withPodfile(config, (podfileConfig) => {
    podfileConfig.modResults.contents = mergeContents({
      tag: "fmt-cxx17",
      src: podfileConfig.modResults.contents,
      newSrc: POST_INSTALL_BLOCK,
      // Right after the react_native_post_install(...) call, whose last argument is this line
      anchor: /:ccache_enabled => ccache_enabled\?\(podfile_properties\),/,
      offset: 2,
      comment: "#",
    }).contents;
    return podfileConfig;
  });
