const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
	resolveApp: resolveApp,
	appPath: resolveApp('.'),
	appPackages: resolveApp('../../packages'),
	appNodeModules: resolveApp('node_modules'),
	appSrc: resolveApp('src'),
	appBuild: resolveApp('dist'),
	appPackageJson: resolveApp('package.json'),
	appIndexJs: resolveApp('src/index.js'),
	appConfigJson: resolveApp('react-builder.json'),
	appSW: resolveApp('src/service-worker.js'),
	appStylIndex: resolveApp('src/style/index.styl'),
};
