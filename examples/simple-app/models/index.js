var Page = require('./page')

module.exports = function (manifest) {
  manifest.use('page', Page)
}
