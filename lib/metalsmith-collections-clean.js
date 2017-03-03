/*
metalsmith-collections-clean
collections were being duplicated
*/
module.exports = function() {

	'use strict';

	return function(files, metalsmith, done) {

		var metadata = metalsmith.metadata();

    /**
     * Delete any existing collections.
     */

    if (metadata.collections){
      Object.keys(metadata.collections).forEach(function(collection){
        delete metadata[collection];
      });
      delete metadata.collections;
    }

		done();

	};

};
