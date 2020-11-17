const Bundler = require('parcel-bundler');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');

const entryFiles = './src/index.ts';

// Bundler options
const options = {
  outDir: './dist', // The out directory to put the build files in, defaults to dist
  outFile: 'index.js', // The name of the outputFile
  publicUrl: '/', // The url to serve on, defaults to '/'
  watch: false, // Whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
  cache: false, // Enabled or disables caching, defaults to true
  cacheDir: '.cache', // The directory cache gets put in, defaults to .cache
  contentHash: false, // Disable content hash from being included on the filename
  global: 'moduleName', // Expose modules as UMD under this name, disabled by default
  minify: true, // Minify files, enabled if process.env.NODE_ENV === 'production'
  scopeHoist: false, // Turn on experimental scope hoisting/tree shaking flag, for smaller production bundles
  target: 'node', // Browser/node/electron, defaults to browser
  bundleNodeModules: false, // By default, package.json dependencies are not included when using 'node' or 'electron' with 'target' option above. Set to true to adds them to the bundle, false by default
  logLevel: 2, // 5 = save everything to a file, 4 = like 3, but with timestamps and additionally log http requests to dev server, 3 = log info, warnings & errors, 2 = log warnings & errors, 1 = log errors, 0 = log nothing
  hmr: false, // Enable or disable HMR while watching
  hmrPort: 0, // The port the HMR socket runs on, defaults to a random free port (0 in node.js resolves to a random free port)
  sourceMaps: true, // Enable or disable sourcemaps, defaults to enabled (minified builds currently always create sourcemaps)
  hmrHostname: '', // A hostname for hot module reload, default to ''
  detailedReport: true, // Prints a detailed report of the bundles, assets, filesizes and times, defaults to false, reports are only printed if watch is disabled
  autoInstall: true, // Enable or disable auto install of missing dependencies found during bundling
};

(async function () {
  const bundler = new Bundler(entryFiles, options);
  await bundler.bundle();
  console.log(chalk.yellow('🚧   Moving some files around...'));
  try {
    fs.copy(
      path.join(__dirname, '..', 'src/public'),
      path.join(__dirname, '..', 'dist/public')
    ).then(() =>
      console.log(chalk.green('✅   Copied Express folders successfully!'))
    );
  } catch (err) {
    console.error(chalk.red(`🚨  Something went wrong: ${err}`));
  }
})();
