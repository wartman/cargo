Cargo
=====

> Still very much a work in progress: everything here is subject
> to change.

A simple flat-file framework.

```javascript
var Cargo = require('cargo')

Cargo({

  'manifest path': 'data',
  'static path': 'public',

  'models': 'app/models',
  'routes': 'app/routes'
  
}).run()

```

Cargo.Manifest
--------------
> Just rambling here for the moment

Loading files in Cargo should feel familiar if you've ever used Backbone, 
or an ORM/ODM. `Manifest.Documents` represent single files (think `Models`), 
while `Manifest.Collections` represent folders.

The quickest way to start using Manifest is with the 'documents' and 'collections'
properties available in routes:

```javascript
// in app/routes/views/some-view.js
module.exports = function (req, res) {
  // `document` is a generic instance of `Manifest.Document`.
  // We're telling it here to load the file '001.*.md' from the folder 'some-folder'
  // in the directory we supplied to Cargo's constructor ("data", in this case)
  req.documents.document(req.params.id, {path: 'some-folder'})
    .fetch()
    .then(function (doc) {
      res.render('index', doc.toJSON())
    }).catch(res.handleError)
}
```

You can make things easier on yourself by extending `Manifest.Document` classes. In our
example app, Cargo will load any javascript files in `app/models` and register them
with `Mainfest`.

Let's say we have a folder in our data directory called 'cats', and we want it to look like
this:

```
data
  |-- cats
  |---- 001.fluffy.md
  |---- 002.butcher.md
  |---- 003.hairball-factory.md
```

In our `app/models` folder, we can create a `cat.js` module that looks like this:

```javascript
// in app/models/cat.js

var Cargo = require('cargo')

var Cat = Cargo.Manifest.Document.extend({
  
  init: function () {
    this.path = 'cats'
    this.$map = { id:0, name:1 }
  }

})

module.exports = Cat

```

`$map` simply maps a segment in a filename to an attribute in the Document. For
example, we've set things up here so that the file `data/cats/001.fluffy.md` will
have the attributes `{id: '001', name: 'fluffy'}`.

To load our cat files, we just add a 'cats' route:

```javascript
// in app/routes/views/cat.js
module.exports = function(req, res) {
  // 'req.documents.cat' is automatically generated for us
  req.documents.cat({name: req.params.name}).fetch().then(function (cat) {
    res.render('pages/cats', cat.toJSON())
  }).catch(res.handleError)
}
```

... and bind it to a route in `app/routes/index.js`:

```javascript
var Cargo = require('cargo')
var imports = Cargo.util.createImporter(__dirname)

var views = imports('views')

module.exports = function (app) {
  app.get('cat/:name', views.cat)
}
```

Now when we start our Cargo app and navigate to `cat/fluffy` we'll
see a page where `data/cats/001.fluffy.md` is loaded.

> more to come, perhaps.
