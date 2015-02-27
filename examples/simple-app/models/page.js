var Rabbit = require('../../../')

var Page = Rabbit.Record.Document.extend({

  // Use init to setup your model.
  init: function () {
    // `path` will tell Rabbit to load files from the matching folder in
    // wherever you set your `record path`
    this.path = 'pages'
    // `$map` tells Rabbit where to match attributes in a filename.
    // For example, the below configuration will parse a filename
    // like this: `[id].[slug].md`. You'd load a file named 
    // `002.some-slug.md` by setting the `id` attribute to '002' or
    // `slug` to 'some-slug'.
    this.$map = {id: 0, slug: 1}
  }

})

module.exports = Page
