# metalsmith-demo
A demonstration site created using the Node.js Metalsmith static site generator.

[Preview the built site...](https://rawgit.com/craigbuckler/metalsmith-demo/master/build/index.html)


## About this code
This code builds a basic HTML-only site using [Metalsmith](http://www.metalsmith.io/), a Node.js simple, pluggable static site generator. It is a demonstration rather than build recommendations which will be different for every site. Please use any part of the code as you wish.


## Installation
Please ensure [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) are installed on your system.

Download the demonstration code and switch to directory:

	git clone git@github.com:craigbuckler/metalsmith-demo.git
	cd metalsmith-demo

Install dependencies:

	npm install


## Build the static site
To build and launch the site using [Browsersync](https://www.browsersync.io/):

	npm start

(Stop the server with `Ctrl+C`.)

To build the site for production and compress HTML files:

	npm run production

The site is built in the `/build` folder.


## Site files
Files in the `src` folder can be edited:

* pages are created as markdown files in the `src/html` folder and all sub-folders.
* static assets such as CSS, JavaScript and image files are created in `src/assets`. These are copied without modification to `build/`.
* page templates are defined in `src/template`.
* reusable partials (chunks of HTML code) are defined in `src/partials`.


### Page definitions
Each sub-folder in `src/html` is a website section. Pages named `index.md` are the default page in section. File paths are translated to permalinks so `src/html/article/mypage.md` becomes `build/article/mypage/index.html`.

Every page has YAML front-matter defined at the top which is used during the build process but may not appear in page content, e.g.

	---
	title: My page title
	description: A description of this page for meta tags and page lists.
	layout: page.html
	priority: 0.9
	publish: 2016-06-01
	date: 2016-06-01
	---

All items are optional. Note:

* `layout` defaults to `page.html` unless `metadata.layout` is defined for the page collection (see the `use(collections({ ... })` code in `build.js`).
* `priority` is a number between 0 (low) and 1 (high) which is used to order menus and define XML sitemaps.
* `publish` can be set `draft` or a future date to ensure it is not published until required.
* `date` is the date of the article. If not set, a future `publish` date or the file creation date is used.

The page content is defined in markdown or HTML syntax below the front-matter section. The content can include [Handlebars](http://handlebarsjs.com/) partials from the `src/partials` folder with the code:

	{{> partialname }}

where `partialname` is the partial filename without its `.html` extension.


## Plugins
The `build.js` file defines how the site is built using Metalsmith and various plugins. Custom plugins are also used:

* `lib/metalsmith-debug.js`: output debugging information to the console.
* `lib/metalsmith-setdate.js`: ensure each page has a date. If `date` front-matter is not available, the page date is presumed to be the publish or file creation date.
* `lib/metalsmith-moremeta.js`: applies further metadata to each page including the root folder, a default layout, primary and secondary navigation.
