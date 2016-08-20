//questionFilter.js

var questionDataRepository = require('../data/question/questionDataRepository').dataRepository;

module.exports.filterFieldAndDiff = function(filter) {
		var sort = {};
		Object.defineProperty(sort, filter.sortFilter, {
			value: filter.sortOrder,
			writable: true,
			enumerable: true,
			configurable: true
		});

	return	sort(sort);
}