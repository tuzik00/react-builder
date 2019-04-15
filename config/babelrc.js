module.exports = {
    plugins: [
        'transform-class-properties',
        'dynamic-import-webpack',
        '@babel/plugin-proposal-export-default-from',
        [
            'transform-object-rest-spread',
            {
                'useBuiltIns': true
            }
        ],
        [
            '@babel/plugin-proposal-decorators',
            {
                'legacy': true
            }
        ]
    ],
    presets: [
        [
            '@babel/preset-env',
            {
                'targets': {
                    'browsers': [
                        'Chrome >= 52',
                        'FireFox >= 44',
                        'Safari >= 7',
                        'Explorer 11',
                        'last 4 Edge versions'
                    ]
                }
            }
        ],
        '@babel/preset-react'
    ],
    env: {
        development: {
            plugins: [
                'react-hot-loader/babel'
            ]
        },
        production: {}
    }
};
