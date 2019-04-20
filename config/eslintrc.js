module.exports = {
    root: true,
    parser: 'babel-eslint',
    plugins: [
        "import",
        "react",
        "jsx-a11y"
    ],
    "globals": {
        "document": true,
        "window": true,
        'Promise': true,
    },
    "env": {
        "shared-node-browser": true,
        "commonjs": true
    },
    parserOptions: {
        "ecmaVersion": 7,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        },
        babelOptions: {
            configFile: require.resolve('./babelrc.js'),
        },
    },
    'rules': {
        "react/prop-types": "off",
        'strict': [2, 'safe'],
        'no-debugger': 1,
        'no-console': [1, {'allow': ['warn', 'error']}],
        'brace-style': [2, '1tbs', {'allowSingleLine': true}],
        'no-trailing-spaces': 2,
        'keyword-spacing': 2,
        'space-before-function-paren': [2, 'never'],
        'spaced-comment': [2, 'always'],
        'vars-on-top': 2,
        'no-undef': 2,
        'no-undefined': 2,
        'comma-dangle': [2, 'always-multiline'],
        'quotes': [2, 'single', {'allowTemplateLiterals': true}],
        'semi': [2, 'always'],
        'guard-for-in': 2,
        'no-eval': 2,
        'no-with': 2,
        'valid-typeof': 2,
        "react/jsx-uses-vars": "error",
        "react/jsx-uses-react": "error",
        'no-continue': 1,
        'no-extra-semi': 1,
        'no-unreachable': 1,
        'no-unused-expressions': 1,
        'no-magic-numbers': [1, {'ignore': [1, 0, -1]}],
        'max-len': [1, 120, 4],
        'no-case-declarations': 0,
        'react/prefer-es6-class': 1,
        'arrow-spacing': ['error', {'before': true, 'after': true}],
        'eol-last': [2, 'always'],
        'block-spacing': [2, 'always']
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended'
    ],
    'settings': {'react': {'version': '16.0.0'}}
};
