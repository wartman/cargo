var _ = require('lodash')
var path = require('path')
var fs = require('fs')
var pluralize = require('pluralize')
var camelCase = require('camel-case')

// Util
// ----
// This module contains a few general utility functions.
var util = {}

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

module.exports = util
