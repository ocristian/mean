/*
 *  Inserts "doc" into the collection "movies".
 */
exports.insert = function(db, doc, callback) {
  	// TODO: implement
	db.collection('movies').insertOne(doc, function(err, result) {
    	callback(null, result);
  	});

};

/*
 *  Finds all documents in the "movies" collection
 *  whose "director" field equals the given director,
 *  ordered by the movie's "title" field. See
 *  http://mongodb.github.io/node-mongodb-native/2.0/api/Cursor.html#sort
 */
exports.byDirector = function(db, director, callback) {

	db.collection('movies')
		.find( { 'director': director } )
		.sort({'title': 1})
		.toArray( function(err, docs) {
			callback(null, docs);
		});
};