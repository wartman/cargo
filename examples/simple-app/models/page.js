var rabbit = require('../../../')

var Page = rabbit.Record.Document.extend({

  init: function () {
    this.path = 'pages'
  }

})

module.exports = Page
