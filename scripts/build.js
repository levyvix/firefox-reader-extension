'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');


const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const bfj = require('bfj');
const config = require('../config/webpack.config.prod');
const paths = require('../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printHostingInstructions = require('react-dev-utils/printHostingInstructions');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const printBuildError = require('react-dev-utils/printBuildError');

const measureFileSizesBeforeBuild =
  FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
const useYarn = fs.existsSync(paths.yarnLockFile);

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// Process CLI arguments
const argv = process.argv.slice(2);
const writeStatsJson = argv.indexOf('--stats') !== -1;

// Detect browser target
const browserTarget = process.env.BROWSER || 'chrome';
const isFirefox = browserTarget === 'firefox';
const buildDir = isFirefox ? 'extension-firefox' : 'build';

if (isFirefox) {
  console.log(chalk.cyan(`Building for Firefox target...\n`));
}

// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.
const { checkBrowsers } = require('react-dev-utils/browsersHelper');
checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    // First, read the current file sizes in build directory.
    // This lets us display how much they changed later.
    return measureFileSizesBeforeBuild(path.join(paths.appPath, buildDir));
  })
  .then(previousFileSizes => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(path.join(paths.appPath, buildDir));
    // Merge with the public folder
    copyPublicFolder();
    // Start the webpack build
    return build(previousFileSizes);
  })
  .then(
    ({ stats, previousFileSizes, warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(
          '\nSearch for the ' +
            chalk.underline(chalk.yellow('keywords')) +
            ' to learn more about each warning.'
        );
        console.log(
          'To ignore, add ' +
            chalk.cyan('// eslint-disable-next-line') +
            ' to the line before.\n'
        );
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
      }

      console.log('File sizes after gzip:\n');
      const outputDir = path.join(paths.appPath, buildDir);
      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        outputDir,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE
      );
      console.log();

      const appPackage = require(paths.appPackageJson);
      const publicUrl = paths.publicUrl;
      const publicPath = config.output.publicPath;
      const buildFolder = path.relative(process.cwd(), outputDir);

      // Copy Firefox-specific files after webpack build
      if (isFirefox) {
        const chromeExtensionDir = path.join(paths.appPath, 'extension');

        // Copy background.js from Chrome extension
        const bgJsSrc = path.join(chromeExtensionDir, 'background.js');
        const bgJsDest = path.join(outputDir, 'background.js');
        if (fs.existsSync(bgJsSrc)) {
          // Replace chrome.* with browser.* for Firefox compatibility
          let bgJsContent = fs.readFileSync(bgJsSrc, 'utf-8');
          bgJsContent = bgJsContent.replace(/chrome\./g, 'browser.');
          fs.writeFileSync(bgJsDest, bgJsContent);
          console.log(chalk.green('✓ Created Firefox background.js'));
        }

        // Copy index.js from Chrome extension
        const indexJsSrc = path.join(chromeExtensionDir, 'index.js');
        const indexJsDest = path.join(outputDir, 'index.js');
        if (fs.existsSync(indexJsSrc)) {
          fs.copySync(indexJsSrc, indexJsDest);
          console.log(chalk.green('✓ Copied Firefox index.js'));
        }

        // Copy main.css from Chrome extension
        const cssSrc = path.join(chromeExtensionDir, 'main.css');
        const cssDest = path.join(outputDir, 'main.css');
        if (fs.existsSync(cssSrc)) {
          fs.copySync(cssSrc, cssDest);
          console.log(chalk.green('✓ Copied Firefox main.css'));
        }

        // Copy images directory from Chrome extension
        const imagesSrc = path.join(chromeExtensionDir, 'images');
        const imagesDest = path.join(outputDir, 'images');
        if (fs.existsSync(imagesSrc)) {
          fs.copySync(imagesSrc, imagesDest);
          console.log(chalk.green('✓ Copied Firefox images'));
        }
      }

      if (!isFirefox) {
        printHostingInstructions(
          appPackage,
          publicUrl,
          publicPath,
          buildFolder,
          useYarn
        );
      } else {
        console.log(chalk.green('✓ Firefox extension build complete: ') + chalk.cyan(buildFolder));
      }
    },
    err => {
      console.log(chalk.red('Failed to compile.\n'));
      printBuildError(err);
      process.exit(1);
    }
  )
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });

// Create the production build and print the deployment instructions.
function build(previousFileSizes) {
  console.log('Creating an optimized production build...');

  let compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages;
      if (err) {
        if (!err.message) {
          return reject(err);
        }
        messages = formatWebpackMessages({
          errors: [err.message],
          warnings: [],
        });
      } else {
        messages = formatWebpackMessages(
          stats.toJson({ all: false, warnings: true, errors: true })
        );
      }
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
          process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ) {
        console.log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n' +
              'Most CI servers set it automatically.\n'
          )
        );
        return reject(new Error(messages.warnings.join('\n\n')));
      }

      const resolveArgs = {
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      };
      if (writeStatsJson) {
        return bfj
          .write(paths.appBuild + '/bundle-stats.json', stats.toJson())
          .then(() => resolve(resolveArgs))
          .catch(error => reject(new Error(error)));
      }

      return resolve(resolveArgs);
    });
  });
}

function copyPublicFolder() {
  const targetDir = path.join(paths.appPath, buildDir);
  fs.copySync(paths.appPublic, targetDir, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });

  // Handle Firefox manifest if building for Firefox
  if (isFirefox) {
    const firefoxManifestSrc = path.join(paths.appPublic, 'manifest-firefox.json');
    const manifestDest = path.join(targetDir, 'manifest.json');
    if (fs.existsSync(firefoxManifestSrc)) {
      fs.copySync(firefoxManifestSrc, manifestDest);
    }
  }
}
