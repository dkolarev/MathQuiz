//db.js

var mongoClient = require('mongodb').MongoClient;

var options = {
	db: {
		bufferMaxEntries: 2
	},
	server: {
		socketOptions: {
			keepAlive: true,
			connectTimeoutMS: 2000
		},
		auto_reconnect: true
	}
};


module.exports.connect = function(config, callb) {
	mongoClient.connect(config.db, options, function(err, database) {
		/*if (err) {
			throw new Error('Unable to connect to database ' + config.db);
		}*/

		require('../data/user/userDataRepository').init(database);
		require('../data/question/questionDataRepository').init(database);
		require('../data/quiz/quizDataRepository').init(database);
		
		callb();
	});
};