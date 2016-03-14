---
title: Gotchas
date: 2016-03-10
---

Not everything is necessarily easy in the Metalsmith world&hellip;


## Incompatible plugins
Some plugins clash with each other. For example,  [metalsmith-rootpath](https://github.com/radiovisual/metalsmith-rootpath) which calculates relative roots does not play nicely with [metalsmith-permalinks](https://github.com/segmentio/metalsmith-permalinks) which creates custom folder structures.

*Note `lib/metalsmith-moremeta` in this project sets a correct `root` variable whether permalinks are used or not.*


## Plugin order can be critical
Plugins can depend on each other or can conflict if placed above another. For example, the RSS-generating [metalsmith-feed](https://github.com/hurrymaplelad/metalsmith-feed) plugin must be called after [metalsmith-layouts](https://github.com/superwolff/metalsmith-layouts) to ensure RSS data is not generated within a page template.


## Browsersync build issues
When [Browsersync](https://www.browsersync.io/) is running and files are edited, collections are re-parsed but the old data remains. This can cause menus and next/back links to be thrown out of synchronization. To fix this, stop and restart the build.
