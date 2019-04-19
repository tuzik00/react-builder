module.exports = {
    root: true,
    parser: 'babel-eslint',
    plugins: ['react'],
    parserOptions: {
        sourceType: 'module',
        allowImportExportEverywhere: false,
        ecmaFeatures: {
            globalReturn: false,
            classes: true,
            jsx: true,
        },
        babelOptions: {
            configFile: require.resolve('./babelrc.js'),
        },
    },
    extends: ['eslint:recommended', 'plugin:react/recommended', 'airbnb-base'],
    rules: {
        'linebreak-style': 0,
        'global-require': 0,
        'eslint linebreak-style': [0, 'error', 'windows'],
        'indent': ['error', 4, {SwitchCase: 1}],
        'no-underscore-dangle': ['error', { 'allow': ['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] }],
    },
};
