const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

config.resolver.blockList = [
  new RegExp(path.resolve(workspaceRoot, "client") + "/.*"),
  new RegExp(path.resolve(workspaceRoot, "server") + "/.*"),
  new RegExp(path.resolve(workspaceRoot, "shared") + "/.*"),
  new RegExp(path.resolve(workspaceRoot, "dist") + "/.*"),
  new RegExp(path.resolve(workspaceRoot, ".git") + "/.*"),
];

config.resolver.disableHierarchicalLookup = true;

const defaultGetModulesRunBeforeMainModule =
  config.serializer?.getModulesRunBeforeMainModule;

config.serializer = {
  ...config.serializer,
  getModulesRunBeforeMainModule: () => {
    const defaults = defaultGetModulesRunBeforeMainModule
      ? defaultGetModulesRunBeforeMainModule()
      : [];
    return [path.resolve(projectRoot, "polyfills.js"), ...defaults];
  },
};

module.exports = config;
