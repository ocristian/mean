/*
 *  Inserts "doc" into the collection "movies".
 */
exports.insert = function(db, doc, callback) {
  	// TODO: implement
	db.collection('movies').insertOne(doc, function(err, result) {
    	callback(result);
  	});

	callback(null);
};

/*
 *  Finds all documents in the "movies" collection
 *  whose "director" field equals the given director,
 *  ordered by the movie's "title" field. See
 *  http://mongodb.github.io/node-mongodb-native/2.0/api/Cursor.html#sort
 */
exports.byDirector = function(db, director, callback) {


	console.info('byDirector: ' + director);
	// TODO: implement
	var cursor = db.collection('movies').find( { 'director': director } ).sort({'title': 1});

	console.info('movies: ' + cursor.size);

	cursor.each(function(err, doc) {

		if (doc != null) {
        	console.dir(doc);
		} else {
        	callback();
      	}
	});

	callback(null, []);
};