//quizFilter.js

module.exports.filter = function(fieldFilter, ratingFilter) {
	if (fieldFilter.length === 0 && ratingFilter.length === 0) {
		return {};
	} else if (fieldFilter.length === 0 || ratingFilter.length === 0) {
		return {$or: [ {"field": {$in: fieldFilter}},
					{"rating": {$in: ratingFilter}}]
				};
	} else {
		return {"field": {$in: fieldFilter}, "rating": {$in: ratingFilter}};
	}
};	