const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Surveiller les packages partagés du monorepo
config.watchFolders = [workspaceRoot];

// Résoudre les modules depuis les deux racines
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Résoudre les alias @jim/*
config.resolver.extraNodeModules = {
  '@jim/shared': path.resolve(workspaceRoot, 'packages/shared/src'),
  '@jim/ui': path.resolve(workspaceRoot, 'packages/ui/src'),
};

module.exports = withNativeWind(config, { input: './global.css' });
