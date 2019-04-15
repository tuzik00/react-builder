#!/usr/bin/env node

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

process.on('unhandledRejection', err => {
    throw err;
});

const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const clearConsole = require('react-dev-utils/clearConsole');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const openBrowser = require('react-dev-utils/openBrowser');
const {checkBrowsers} = require('react-dev-utils/browsersHelper');

const {
    choosePort,
    createCompiler,
    prepareProxy,
    prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');

const getClientEnvironment = require('../config/env');
const paths = require('../config/paths');
const configFactory = require('../config/webpack.config');
const createDevServerConfig = require('../config/webpackDevServer.config');

if (!checkRequiredFiles([paths.appIndexJs, paths.appStylIndex])) {
    process.exit(1);
}

if (process.env.HOST) {
    console.log(
        chalk.cyan(`Attempting to bind to HOST environment variable: ${chalk.yellow(chalk.bold(process.env.HOST))}`)
    );
}

const isInteractive = process.stdout.isTTY;
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';


checkBrowsers(paths.appPath, isInteractive)
    .then(() => choosePort(HOST, DEFAULT_PORT))
    .then(port => {
        if (port == null) {
            return;
        }

        const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
        const appName = require(paths.appPackageJson).name;
        const urls = prepareUrls(protocol, HOST, port);

        const devSocket = {
            warnings: warnings =>
                devServer.sockWrite(devServer.sockets, 'warnings', warnings),
            errors: errors =>
                devServer.sockWrite(devServer.sockets, 'errors', errors),
        };

        const {raw} = getClientEnvironment();
        const config = configFactory(raw.NODE_ENV);

        config.entry.push(
            `webpack-dev-server/client?${urls.localUrlForBrowser}`,
            'webpack/hot/only-dev-server'
        );

        config.resolve.alias = {
            'react-dom': '@hot-loader/react-dom'
        };

        const compiler = createCompiler({
            appName,
            config,
            devSocket,
            urls,
            webpack,
        });

        const proxySetting = require(paths.appPackageJson).proxy;
        const proxyConfig = prepareProxy(proxySetting, paths.appBuild);
        const serverConfig = createDevServerConfig(proxyConfig, urls.lanUrlForConfig);
        const devServer = new WebpackDevServer(compiler, serverConfig);

        devServer.listen(port, HOST, err => {
            if (err) {
                return console.log(err);
            }

            if (isInteractive) {
                clearConsole();
            }

            openBrowser(urls.localUrlForBrowser);
        });

        ['SIGINT', 'SIGTERM'].forEach(function (sig) {
            process.on(sig, function () {
                devServer.close();
                process.exit();
            });
        });
    })
    .catch(err => {
        if (err && err.message) {
            console.log(err.message);
        }

        process.exit(1);
    });
