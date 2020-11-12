const CordovaLogger = require('cordova-common').CordovaLogger;

module.exports = {
  adjustLoggerLevel(opts) {
    if (Array.isArray(opts)) {
      opts.silent = opts.includes('--silent');
      opts.verbose = opts.includes('--verbose');
    }

    if (opts.silent) {
      CordovaLogger.get().setLevel('error');
    }

    if (opts.verbose) {
      CordovaLogger.get().setLevel('verbose');
    }
  },
};
