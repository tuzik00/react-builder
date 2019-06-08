const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const paths = require('./paths');
const fs = require('fs')
const jeetPlugin = require('jeet');
const rupture = require('rupture');
const nibPlugin = require('nib');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const ManifestPlugin = require('webpack-manifest-plugin');
const getClientEnvironment = require('./env');
const publicPath = '';
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);
const WorkboxPlugin = require('workbox-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');


module.exports = (webpackEnv) => {
    const isEnvDevelopment = webpackEnv === 'development';
    const isEnvProduction = webpackEnv === 'production';
    const hasSW = fs.existsSync(paths.appSW);
    const publicPath = isEnvProduction
        ? '/'
        : '/';

    const appConfigJs = fs.existsSync(paths.appConfigJs)
        ? require(paths.appConfigJs)
        : require('./react-builder.config');

    return {
        mode: webpackEnv,
        devtool: isEnvProduction
            ? 'source-map'
            : 'eval',
        entry: [
            isEnvDevelopment && require.resolve('react-dev-utils/webpackHotDevClient'),
            paths.appIndexJs,
        ].filter(Boolean),
        output: {
            path: paths.appBuild,
            filename: isEnvProduction
                ? 'js/[name].[contenthash:8].js'
                : 'js/[name].js',
            chunkFilename: isEnvProduction
                ? 'js/[name].[contenthash:8].bundle.js'
                : 'js/[name].bundle.js',
            publicPath: publicPath,
        },
        resolve: {
            modules: [
                'node_modules',
                paths.appNodeModules,
                paths.appSrc
            ],
            extensions: ['.js', '.json', '.jsx', '.styl'],
        },
        module: {
            strictExportPresence: true,
            rules: [
                {
                    test: /\.jsx?$/,
                    include: [
                        paths.appSrc,
                    ],
                    enforce: 'pre',
                    use: [
                        {
                            loader: require.resolve('eslint-loader'),
                            options: {
                                baseConfig: {
                                    extends: [
                                        require.resolve('./eslintrc.js')
                                    ],
                                },
                                ignore: false,
                                useEslintrc: false,
                            }
                        }
                    ],
                },
                {
                    test: /\.jsx?$/,
                    include: [
                        paths.appSrc,
                        paths.appPackages,
                    ],
                    use: [
                        {
                            loader: require.resolve('babel-loader'),
                            options: {
                                babelrc: false,
                                configFile: require.resolve('./babelrc.js'),
                                cacheDirectory: true,
                                cacheCompression: isEnvProduction,
                                compact: isEnvProduction,
                            },
                        }
                    ]
                },
                {
                    test: /\.jsx?$/,
                    include: [
                        paths.appSrc,
                        paths.appPackages,
                    ],
                    exclude: /@babel(?:\/|\\{1,2})runtime/,
                    use: [
                        {
                            loader: require.resolve('babel-loader'),
                            options: {
                                babelrc: false,
                                configFile: require.resolve('./babelrc.js'),
                                cacheDirectory: true,
                                cacheCompression: isEnvProduction,
                                compact: isEnvProduction,
                            },
                        },
                    ],
                },
                {
                    test: [/\.gif$/, /\.jpe?g$/, /\.png$/, /\.bg\.svg$/],
                    loader: require.resolve('url-loader'),
                    options: {
                        limit: 10000,
                        name: '[name].[ext]',
                        outputPath: 'media/'
                    }
                },
                {
                    test: /\.svg$/,
                    exclude: [/\.bg\.svg$/],
                    use: [
                        {
                            loader: require.resolve('babel-loader')
                        },
                        {
                            loader: require.resolve('react-svg-loader'),
                            options: {
                                svgo: require('./svgoConfig'),
                                name: '[name].[ext]',
                                outputPath: 'media/',
                            }
                        }
                    ]
                },
                {
                    test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    use: [{
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 10000,
                            name: '[name].[ext]',
                            outputPath: 'fonts/',
                        }
                    }]
                },
                {
                    test: /\.(ttf|eot)(\?[\s\S]+)?$/,
                    use: [{
                        loader: require.resolve('file-loader'),
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }]
                },
                {
                    test: /\.(styl|css)$/,
                    use: [
                        isEnvDevelopment && require.resolve('style-loader'),
                        isEnvProduction && {
                            loader: MiniCssExtractPlugin.loader,
                            options: {},
                        },
                        {
                            loader: require.resolve('css-loader'),
                            options: {
                                importLoaders: 1,
                                sourceMap: true,
                                modules: true,
                                localIdentName: '[local]'
                            }
                        },
                        {
                            loader: require.resolve('postcss-loader'),
                            options: {
                                ident: 'postcss',
                                sourceMap: true,
                                plugins: () => [
                                    require('postcss-flexbugs-fixes'),
                                    autoprefixer({
                                        browsers: [
                                            'Chrome >= 52',
                                            'FireFox >= 44',
                                            'Safari >= 7',
                                            'Explorer 11',
                                            'last 4 Edge versions'
                                        ],
                                        flexbox: 'no-2009'
                                    })
                                ]
                            }
                        },
                        {
                            loader: require.resolve("stylus-loader"),
                            options: {
                                use: [jeetPlugin(), rupture(), nibPlugin()],
                                import: paths.appStylIndex,
                                resolveUrl: true,
                                sourceMap: true
                            }
                        }
                    ].filter(Boolean)
                },
            ]
        },
        plugins: [
            ...(appConfigJs.html || [])
                .map((htmlConfig) => new HtmlWebpackPlugin(
                    Object.assign(
                        {
                            template: paths.resolveApp(htmlConfig.template),
                            ...htmlConfig,
                        },
                        isEnvProduction
                            ? {
                                minify: {
                                    removeComments: true,
                                    collapseWhitespace: true,
                                    removeRedundantAttributes: true,
                                    useShortDoctype: true,
                                    removeEmptyAttributes: true,
                                    removeStyleLinkTypeAttributes: true,
                                    keepClosingSlash: true,
                                    minifyJS: true,
                                    minifyCSS: true,
                                    minifyURLs: true,
                                },
                            }
                            : undefined
                    )
                )),

            isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),

            isEnvProduction && new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash:8].css',
                chunkFilename: 'css/[name].[contenthash:8].chunk.css',
            }),

            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

            new webpack.DefinePlugin(env.stringified),

            new CopyPlugin(appConfigJs.copy),

            new ManifestPlugin({
                fileName: 'assets-manifest.json',
                publicPath: publicPath,
            }),

            appConfigJs.manifestJson && new WebpackPwaManifest(
                appConfigJs.manifestJson
            ),

            hasSW && new WorkboxPlugin.InjectManifest({
                swSrc: paths.appSW,
            }),
        ].filter(Boolean),
        optimization: {
            minimize: isEnvProduction,
            minimizer: [
                new OptimizeCSSAssetsPlugin({
                    cssProcessorOptions: {
                        parser: safePostCssParser,
                        map: {
                            inline: false,
                            annotation: true,
                        }
                    },
                }),
            ],
            splitChunks: {
                chunks: 'async',
                minSize: 30000,
                minChunks: 1,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                name: true,
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                        enforce: true,
                        priority: -10,
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                        enforce: true,
                    },
                }
            }
        },
    }
};
