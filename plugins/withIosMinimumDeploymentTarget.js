const { withPodfile } = require("expo/config-plugins");
const { mergeContents } = require("@expo/config-plugins/build/utils/generateCode");

// Xcode 27 rejects deployment targets below iOS 15, some pods still declare older ones
const POST_INSTALL_BLOCK = `    minimum_deployment_target = podfile_properties['ios.deploymentTarget'] || '15.1'
    installer.generated_projects.each do |project|
      project.targets.each do |target|
        target.build_configurations.each do |config|
          deployment_target = config.build_settings['IPHONEOS_DEPLOYMENT_TARGET']
          if deployment_target.nil? || Gem::Version.new(deployment_target) < Gem::Version.new(minimum_deployment_target)
            config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = minimum_deployment_target
          end
        end
      end
    end
`;

module.exports = (config) =>
  withPodfile(config, (podfileConfig) => {
    podfileConfig.modResults.contents = mergeContents({
      tag: "ios-minimum-deployment-target",
      src: podfileConfig.modResults.contents,
      newSrc: POST_INSTALL_BLOCK,
      // Right after the react_native_post_install(...) call, whose last argument is this line
      anchor: /:ccache_enabled => ccache_enabled\?\(podfile_properties\),/,
      offset: 2,
      comment: "#",
    }).contents;
    return podfileConfig;
  });
