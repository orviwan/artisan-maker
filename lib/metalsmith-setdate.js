/*
metalsmith-setdate
ensures every file has a date set
adds dateFormat metadata with formatted creation date
*/
module.exports = function() {

	'use strict';

	var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	return function(files, metalsmith, done) {

		var file, f;

		for (f in files) {

			file = files[f];

			if (file.date) {
				// add default date from front-matter
				file.date = new Date(file.date);
			}
			else {
				// add default date from file creation time
				file.date = (file.stats && file.stats.ctime) || new Date();
			}

			// add a formatted date
			file.dateFormat = file.date.getUTCDate() + ' ' + month[file.date.getUTCMonth()] + ' ' + file.date.getUTCFullYear();

		}

		done();

	};

};
