const fs = require('fs');
const path = require('path');
const NODE_PATH = process.env.NODE_PATH;
const appDirectory = fs.realpathSync(process.cwd());
const REACT_APP = /^REACT_APP_/i;

delete require.cache[require.resolve('./paths')];


process.env.NODE_PATH = (NODE_PATH || '')
    .split(path.delimiter)
    .filter(folder => folder && !path.isAbsolute(folder))
    .map(folder => path.resolve(appDirectory, folder))
    .join(path.delimiter);


function getClientEnvironment(publicUrl) {
    const raw = Object.keys(process.env)
        .filter(key => REACT_APP.test(key))
        .reduce(
            (env, key) => {
                env[key] = process.env[key];
                return env;
            },
            {
                NODE_ENV: process.env.NODE_ENV || 'development',
                PUBLIC_URL: publicUrl,
            }
        );

    const stringified = {
        'process.env': Object.keys(raw).reduce((env, key) => {
            env[key] = JSON.stringify(raw[key]);
            return env;
        }, {})
    };

    return {raw, stringified};
}


module.exports = getClientEnvironment;
