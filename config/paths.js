const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
	appPath: resolveApp('.'),
	appPackages: resolveApp('packages'),
	appNodeModules: resolveApp('node_modules'),
	appSrc: resolveApp('src'),
	appBuild: resolveApp('dist'),
	appStorybook: resolveApp('.storybook'),
	appPackageJson: resolveApp('package.json'),
	appIndexJs: resolveApp('src/index.js'),
    appHtml: resolveApp('src/index.html'),
	appStylIndex: resolveApp('src/style/index.styl'),
};
