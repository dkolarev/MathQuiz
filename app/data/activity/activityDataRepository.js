//activityDataRepository.js

var activityCollection;

module.exports.init = function(db) {
	activityCollection = db.collection('activity');
};

var insertActivity = function(activity) {
	return activityCollection.insertOne(activity);
};

var queryAllActivity = function() {
	return activityCollection.find();
};


module.exports.dataRepository = {
	insertActivity: insertActivity,
	queryAllActivity: queryAllActivity
};