---
title: Some Folder
---
This doesn't work yet, but it would be neat to allow folders like this.

Perhaps Record.IO can run fs.statSync, then check for 'index.md' (as the default) and 
any files (like images) that are hanging out in the same folder? It could always return an
object structured like so:

```
  {
    filename: <filename>, // In this case, will be the containing folder, not `index.md`
    content: <body>,
    related: [
      <array of other filenames that are in the folder>
    ]
  }
```

It'll be up to each model to parse all this.

Defiantly for the next release.
