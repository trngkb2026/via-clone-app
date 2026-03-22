const { execSync } = require('child_process');

exports.default = async function(context) {
  const appPath = context.appOutDir;
  execSync(`xattr -cr "${appPath}"`, { stdio: 'inherit' });
};
