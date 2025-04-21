const tsConfigPaths = require('tsconfig-paths');
const tsConfig = require('./tsconfig.json');

// Register path aliases
tsConfigPaths.register({
  baseUrl: tsConfig.compilerOptions.baseUrl,
  paths: tsConfig.compilerOptions.paths
}); 