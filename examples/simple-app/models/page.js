var Rabbit = require('../../../')

var Page = Rabbit.Record.Document.extend({

  init: function () {
    this.path = 'pages'
  }

})

module.exports = Page
