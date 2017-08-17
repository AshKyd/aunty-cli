// External
const minimist = require('minimist');

// Ours
const {getConfig} = require('../projects');
const {pack, packs, throws} = require('../utils/async');
const {createCommandLogo} = require('../utils/logo');
const {log} = require('../utils/console');
const {DEFAULTS, MESSAGES} = require('./constants');

let isEntryCommand;

const command = module.exports.command = ({
  name,
  options,
  usage,
  isProxy,
  configRequired
}, fn) => {
  name = name || DEFAULTS.COMMAND_NAME;
  options = options || DEFAULTS.OPTIONS;
  usage = usage || MESSAGES.usage;

  return packs(async (args = [], ...misc) => {
    const argv = minimist(args, options);
    const fnArgs = [argv, ...misc];
    let err;
    let config;
    let requiredProps;

    if (argv.help) {
      return log(typeof usage === 'function' ? usage(name) : usage);
    }

    if (!isEntryCommand) {
      isEntryCommand = true;
      log(createCommandLogo(name));
    }

    argv.$ = args;

    if (configRequired) {
      requiredProps = Array.isArray(configRequired) ? configRequired : [];
      [err, config] = await getConfig(requiredProps);
      fnArgs.splice(1, 0, config);
    }

    if (!err) {
      [err] = await pack(fn(...fnArgs));
    }

    if (err) {
      throw err;
    }
  });
};

module.exports.projectTypeRouter = ({name, isProxy}, commands) => command({
  name,
  isProxy,
  configRequired: ['type']
}, async (argv, config) => {
  if (!commands[config.type]) {
    throw MESSAGES.unrecognised(config.type);
  }

  throws(await commands[config.type](argv.$));
});
