module.exports = function ({name, host, port, publicDir}) {
    return {
        host,
        name,
        port,
        reload: false,
        injectCss: false,
        server: {
            baseDir: [
                publicDir,
            ]
        },
    };
};
