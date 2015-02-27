Cargo
=====

A dumb flat-file `cms`.

I plan to add admin stuff in the future maybe. Or give up on this
and do something more reasonable but, hey, it'll work.

Only very basic functionality in right now. Probably good enough for
a small portfolio site.

```
var Cargo = require('cargo')

Cargo({

  'manifest path': 'data',
  'static path': 'public',

  'models': require('./models'),
  'routes': require('./routes')
  
}).run()

```
