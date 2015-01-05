var _ = require('lodash')
var Class = require('./class')
var error = require('./error')
var chalk = require('chalk')

// Logger
// ------
var Logger = Class.extend({

  constructor: function (env) {
    this.env = env || process.env.NODE_ENV || 'production'
  },

  // Check the env and return true if we should be
  // logging things. This doesn't actually do much yet,
  // but future proof and all that.
  shouldLog: function () {
    return (this.env === 'development' ||
            this.env === 'staging' ||
            this.env === 'production')
  },

  logInfo: function (label, info, help) {
    if (!this.shouldLog()) return
    var msg = [chalk.yellow.bold('\n', label), chalk.grey('\n', info)]
    if (help) msg.push('\n', chalk.grey('[', help, ']'))
    console.info.apply(console, msg)
  },

  logWarn: function (warn, ctx, help) {
    if (!this.shouldLog()) return
    warn = warn || 'no message supplied'
    var msgs = [chalk.yellow('\n Warning:\n'), chalk.grey(warn, '\n')]
    if (ctx) msgs.push(chalk.grey(ctx, '\n'))
    if (help) msgs.push(chalk.grey('[', help, ']'))
    msgs.push('\n')
    console.log.apply(console, msgs)
  },

  logError: function(err, ctx, help) {
    // Always log
    err = _.isString(err) 
      ? err 
      : (_.isObject(err) 
        ? err.message 
        : 'An unknown error occurred.')
    err = err || 'no message supplied'
    var msgs = [chalk.red.bold('\n', 'ERROR\n'),  chalk.red(err, '\n')]
    if (ctx) msgs.push(chalk.yellow(ctx, '\n'))
    if (help) msgs.push(chalk.grey(help))
    msgs.push('\n')
    console.log.apply(console, msgs)
  },

  logAndThrowError: function (err, ctx, help) {
    this.logError(err, ctx, help)
    error.helpers.throwError(err)
  },

  logAndRejectError: function (err, ctx, help) {
    this.logError(err, ctx, help)
    return error.helpers.rejectError(err)
  }

})

Logger.getInstance = function () {
  if (!this._instance) this._instance = new Logger()
  return this._instance
}

module.exports = Logger
