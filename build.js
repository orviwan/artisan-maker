#!/usr/bin/env node

/*
Metalsmith build file
Build site with `node ./build.js` or `npm start`
Build production site with `npm run production`
*/

'use strict';

var
// defaults
  consoleLog = false, // set true for metalsmith file and meta content logging
  devBuild = ((process.env.NODE_ENV || '').trim().toLowerCase() !== 'production'),
  pkg = require('./package.json'),

  // main directories
  dir = {
    base: __dirname + '/',
    lib: __dirname + '/lib/',
    source: './src/',
    dest: './build/'
  },

  // modules
  metalsmith = require('metalsmith'),
  markdown = require('metalsmith-markdown'),
  publish = require('metalsmith-publish'),
  wordcount = require("metalsmith-word-count"),
  collections = require('metalsmith-collections'),
  permalinks = require('metalsmith-permalinks'),
  inplace = require('metalsmith-in-place'),
  layouts = require('metalsmith-layouts'),
  sitemap = require('metalsmith-mapsite'),
  rssfeed = require('metalsmith-feed'),
  sass = require('metalsmith-sass'),
  assets = require('metalsmith-assets'),
  moveRemove = require('metalsmith-move-remove'),
  htmlmin = devBuild ? null : require('metalsmith-html-minifier'),
  browsersync = devBuild ? require('metalsmith-browser-sync') : null,
  helpers = require('metalsmith-register-helpers'),

  // custom plugins
  setdate = require(dir.lib + 'metalsmith-setdate'),
  moremeta = require(dir.lib + 'metalsmith-moremeta'),
  debug = consoleLog ? require(dir.lib + 'metalsmith-debug') : null,
  collectionsclean = require(dir.lib + 'metalsmith-collections-clean'),

  siteMeta = {
    devBuild: devBuild,
    version: pkg.version,
    name: 'Artisan Maker',
    desc: 'A demonstration static site built using Metalsmith',
    author: 'Jon Barlow',
    contact: 'https://twitter.com/orviwan',
    domain: devBuild ? 'http://127.0.0.1' : 'https://rawgit.com', // set domain
    rootpath: devBuild ? null : '/' // set absolute path (null for relative)
  },

  templateConfig = {
    engine: 'handlebars',
    directory: dir.source + 'template/',
    partials: dir.source + 'partials/',
    default: 'page.html',
    pattern: ['**/*.html', '**/*.md']
  };

console.log((devBuild ? 'Development' : 'Production'), 'build, version', pkg.version);

var ms = metalsmith(dir.base)
  .clean(true) // clean folder before a production build (!devBuild)
  .source(dir.source + 'html/') // source folder (src/html/)
  .destination(dir.dest) // build folder (build/)
  .metadata(siteMeta) // add meta data to every page
  .use(publish()) // draft, private, future-dated
  .use(setdate()) // set date on every page if not set in front-matter
  .use(collectionsclean())
  .use(collections({ // determine page collection/taxonomy
    page: {
      pattern: '**/index.*',
      sortBy: 'priority',
      reverse: true,
      refer: false
    },
    start: {
      pattern: 'start/**/*',
      sortBy: 'priority',
      reverse: true,
      refer: true,
      metadata: {
        layout: 'article.html'
      }
    },
    article: {
      pattern: 'article/**/*',
      sortBy: 'date',
      reverse: true,
      refer: true,
      limit: 50,
      metadata: {
        layout: 'article.html'
      }
    },
    product: {
      pattern: 'product/**/*',
      sortBy: 'priority',
      reverse: false,
      refer: true,
      metadata: {
        layout: 'product.html'
      }
    }
  }))
  .use(markdown()) // convert markdown
  .use(permalinks({ // generate permalinks
    pattern: ':mainCollection/:title'
  }))
  .use(wordcount({
    raw: true
  })) // word count
  .use(moremeta()) // determine root paths and navigation
  .use(helpers({
    "directory": "lib/_helpers"
  }))
  .use(inplace(templateConfig)) // in-page templating
  .use(layouts(templateConfig)) // layout templating
  // SITEMAP XML
  .use(sitemap({
    hostname: siteMeta.domain + (siteMeta.rootpath || ''),
    omitIndex: true
  }))
  // ARTICLES RSS
  .use(rssfeed({
    collection: 'article',
    site_url: siteMeta.domain + (siteMeta.rootpath || ''),
    title: siteMeta.name,
    description: siteMeta.desc
  }))
  // IMAGES
  .use(assets({
    source: dir.source + 'html/_assets/images/',
    destination: '../build/images/'
  }));

// SASS
if (devBuild) {
  ms.use(sass({
    outputStyle: 'expanded',
    outputDir: './css/',
    sourceMap: true,
    sourceMapContents: true
  }));
} else {
  ms.use(sass({
    outputStyle: 'compressed',
    outputDir: './css/'
  }));
}

ms.use(moveRemove({
  remove: ['_assets']
}))

// MINIFY HTML
if (htmlmin) ms.use(htmlmin());

// DEBUG LOG
if (debug) ms.use(debug()); // output page debugging information

// BROWSERSYNC
if (browsersync) {
  ms.use(browsersync(
    { // start test server
      server: dir.dest,
      files: [dir.source + '**/*']
    })
  );
}

// BUILD
ms.build(function(err) {
  if (err) throw err;
});

