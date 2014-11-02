var _ = require('lodash')
var chalk = require('chalk')
var jajom = require('jajom')

var config = require('../config').getInstance()
var helpers = require('../errors/helpers')

// ErrorLogger
// -----------
// A singleton for prettier error handling.
var ErrorLogger = jajom.Singleton.extend({

  constructor: function (env) {
    // this.env = env || process.env.NODE_ENV
    this.env = 'development'
  },

  // Check the env and return true if we should be
  // logging things. This doesn't actually do much yet,
  // but future proof and all that.
  shouldLog: function () {
    return (this.env === 'development' ||
            this.env === 'staging' ||
            this.env === 'production')
  }


}, {

  logInfo: function (component, info) {
    var logger = this.getInstance()
    if (logger.shouldLog()) {
      var msg = [chalk.yellow(component, ':'), chalk.white(info)]
      console.info.apply(console, msg)
    }
  },

  logWarn: function (warn, ctx, help) {
    var logger = this.getInstance()
    if (logger.shouldLog()) {
      warn = warn || 'no message supplied'
      var msgs = [chalk.yellow('\n Warning:\n'), chalk.white(warn, '\n')]
      if (ctx) msgs.push(chalk.white(ctx, '\n'))
      if (help) msgs.push(chalk.green(help))
      msgs.push('\n')
      console.log.apply(console, msgs)
    }
  },

  logError: function(err, ctx, help) {
    var logger = this.getInstance()
    if (logger.shouldLog()) {
      err = _.isString(err) 
        ? err 
        : (_.isObject(err) 
          ? err.message 
          : 'An unknown error occurred.')
      err = err || 'no message supplied'
      var msgs = [chalk.red('\n ERROR:\n'),  chalk.red(err, '\n')]
      if (ctx) msgs.push(chalk.white(ctx, '\n'))
      if (help) msgs.push(chalk.green(help))
      msgs.push('\n')
      console.log.apply(console, msgs)
    }

  },

  logAndThrowError: function (err, ctx, help) {
    this.logError(err, ctx, help)
    helpers.throwError(err)
  },

  logAndRejectError: function (err, ctx, help) {
    this.logError(err, ctx, help)
    return helpers.rejectError(err)
  }

})

module.exports = ErrorLogger
