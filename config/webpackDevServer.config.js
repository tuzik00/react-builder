const ignoredFiles = require('react-dev-utils/ignoredFiles');
const paths = require('./paths');

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || '0.0.0.0';


module.exports = function (proxy, allowedHost) {
    return {
        compress: false,
        clientLogLevel: 'none',
        disableHostCheck: true,
        inline: true,
        hot: true,
        historyApiFallback: true,
        contentBase: paths.appSrc,
        publicPath: '/',
        watchOptions: {
            ignored: ignoredFiles(paths.appSrc),
        },
        https: protocol === 'https',
        host: host,
        overlay: false,
        public: allowedHost,
        proxy
    };
};
