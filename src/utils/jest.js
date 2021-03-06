const BabelJest = require('babel-jest');
const guessRootPath = require('guess-root-path');
const Path = require('path');

const { getConfig } = require('../projects/config');

module.exports = {
  process(src, filename, config, options) {
    // Handle media requires
    if (filename.match(/\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$/)) {
      return 'module.exports = ' + JSON.stringify(Path.basename(filename)) + ';';
    } else if (filename.match(/\.s?css$/)) {
      return `module.exports = new Proxy({}, { get: (styles, method) => method });`;
    }

    // Try to work out what kind of project this is
    let projectType = 'basic-app';
    try {
      const aunty = require(`${guessRootPath()}/package.json`).aunty;
      if (typeof aunty === 'string') {
        projectType = aunty;
      } else {
        projectType = aunty.type;
      }
    } catch (ex) {
      // Nothing, just leave it as assuming basic-app
    }
    const typeConfig = require(`../projects/${projectType}`);
    const babelConfig = typeConfig.babel || {};

    return BabelJest.createTransformer(babelConfig).process(src, filename, config, { sourceMaps: false });
  }
};
