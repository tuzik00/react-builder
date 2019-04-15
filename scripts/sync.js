#!/usr/bin/env node

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

process.on('unhandledRejection', err => {
    throw err;
});

const webpack = require('webpack');
const browserSync = require('browser-sync').create();
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');

const {
    prepareUrls,
    choosePort,
} = require('react-dev-utils/WebpackDevServerUtils');

const paths = require('../config/paths');
const createBrowserSyncConfig = require('../config/browserSync.config');

if (!checkRequiredFiles([paths.appIndexJs, paths.appStylIndex])) {
    process.exit(1);
}

if (process.env.HOST) {
    console.log(
        chalk.cyan(`Attempting to bind to HOST environment variable: ${chalk.yellow(chalk.bold(process.env.HOST))}`)
    );
}

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3001;
const HOST = process.env.HOST || '0.0.0.0';


choosePort(HOST, DEFAULT_PORT)
    .then((port) => {
        if (port == null) {
            return;
        }

        const configFactory = require('../config/webpack.config')(process.env.NODE_ENV);

        configFactory.resolve.alias = {
            'react-dom': '@hot-loader/react-dom'
        };

        let compiler = webpack(configFactory);

        return new Promise((resolve, reject) => {
            compiler.watch({}, function (err, stats) {
                if (err) {
                    return reject(err);
                }

                console.warn(stats.toString({
                    colors: true,
                    children: false,
                    chunks: false,
                    modules: false
                }));

                return resolve({
                    compiler,
                    port,
                    stats,
                });
            });
        });
    })
    .then(({compiler, port, stats}) => {
        const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
        const urls = prepareUrls(protocol, HOST, port);
        const appName = require(paths.appPackageJson).name;

        const browserSyncConfig = createBrowserSyncConfig({
            name: appName,
            host: urls.lanUrlForConfig,
            port: port,
            publicDir: paths.appBuild,
        });

        browserSync.init(browserSyncConfig);

        compiler.hooks.done.tap('build', function () {
            browserSync.reload();
        });

        return stats;
    })
    .catch(err => {
        if (err && err.message) {
            console.log(err.message);
        }

        process.exit(1);
    });
