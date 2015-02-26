var _ = require('lodash')
var path = require('path')
var fs = require('fs')
var validator = require('validator')
var pluralize = require('pluralize')
var camelCase = require('camel-case')

var util = {
  // Time constants 
  ONE_HOUR_S: 3600,
  ONE_DAY_S: 86400,
  ONE_YEAR_S: 31536000,
  ONE_HOUR_MS: 3600000,
  ONE_DAY_MS: 86400000,
  ONE_YEAR_MS: 31536000000
}

// Shortcuts
util.pluralize = pluralize
util.camelCase = camelCase

// Capitalize the first letter in a string
util.capitalize = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// Create an importer that can be used to import all modules
// in a given directory. Based on keystone's implementation.
util.createImporter = function createImporter(relDir, options) {

  options || (options = {})
  options = _.defaults(options, {
    transform: util.camelCase
  })

  var importer = function importer(from) {
    var imported = {}
    var joinPath = function () {
      return '.' + path.sep + path.join.apply(path, arguments)
    }
    var fsPath = joinPath(path.relative(process.cwd(), relDir), from)
    fs.readdirSync(fsPath).forEach(function (name) {
      var info = fs.statSync(path.join(fsPath, name))
      if (info.isDirectory()) {
        // Recursive
        imported[options.transform(name)] = importer(joinPath(from, name))
      } else {
        // Only import javascript files
        var parts = name.split('.')
        var ext = parts.pop()
        if (ext === 'js') {
          imported[options.transform(parts.join('-'))] = require(path.join(relDir, from, name))
        }
      }
    })
    return imported
  }

  return importer
}

// Validator
util.validator = validator

// Add a few custom validations.
validator.extend('empty', function (val) {
  return _.isEmpty(val)
})

validator.extend('notContains', function (val, comp) {
  return !_.contains(val, comp)
})

module.exports = util
