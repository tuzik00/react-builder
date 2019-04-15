#!/usr/bin/env node

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

process.on('unhandledRejection', err => {
    throw err;
});

require('../config/env');

const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printHostingInstructions = require('react-dev-utils/printHostingInstructions');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const configFactory = require('../config/webpack.config')(process.env.NODE_ENV);
const paths = require('../config/paths');

const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;

const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;


if (!checkRequiredFiles([paths.appIndexJs])) {
    process.exit(1);
}


measureFileSizesBeforeBuild(paths.appBuild)
    .then(previousFileSizes => {
        fs.emptyDirSync(paths.appBuild);

        return build(previousFileSizes);
    })
    .then(
        ({stats, previousFileSizes, warnings}) => {
            if (warnings.length) {
                console.log(chalk.yellow('Compiled with warnings.\n'));
            } else {
                console.log(chalk.green('Compiled successfully.\n'));
            }

            console.log('File sizes after gzip:\n');

            printFileSizesAfterBuild(
                stats,
                previousFileSizes,
                paths.appBuild,
                WARN_AFTER_BUNDLE_GZIP_SIZE,
                WARN_AFTER_CHUNK_GZIP_SIZE
            );

            const appPackage = require(paths.appPackageJson);
            const publicUrl = paths.publicUrl;
            const publicPath = configFactory.output.publicPath;
            const buildFolder = path.relative(process.cwd(), paths.appBuild);

            printHostingInstructions(
                appPackage,
                publicUrl,
                publicPath,
                buildFolder,
            );
        },
        err => {
            console.log(chalk.red('Failed to compile.\n'));
            console.log((err.message || err) + '\n');

            process.exit(1);
        }
    );

function build(previousFileSizes) {
    console.log('Creating an optimized production build...');

    let compiler = webpack(configFactory);

    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) {
                return reject(err);
            }

            const messages = formatWebpackMessages(stats.toJson({}, true));

            if (messages.errors.length) {
                return reject(new Error(messages.errors.join('\n\n')));
            }

            return resolve({
                stats,
                previousFileSizes,
                warnings: messages.warnings,
            });
        });
    });
}
