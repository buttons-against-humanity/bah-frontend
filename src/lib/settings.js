const packagejson = require('../../package.json');

export default {
  appName: packagejson.name,
  appDescription: packagejson.description,
  version: packagejson.version
};
