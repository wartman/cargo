var Page = require('./page')

module.exports = function (record) {
  record.use('page', Page)
}
