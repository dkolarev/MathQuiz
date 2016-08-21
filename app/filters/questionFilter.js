//questionFilter.js

module.exports.filter = function(fieldFilter, difficultyFilter) {
	if(fieldFilter.length === 0 && difficultyFilter.length === 0) {
		return {};
	} else if (fieldFilter.length === 0 || difficultyFilter.length === 0) {
		return {$or: [{"field": {$in: fieldFilter}}, 
					{"difficulty": {$in: difficultyFilter}}]};
	} else {
		return {"difficulty": {$in: difficultyFilter}, "field": {$in: fieldFilter}};
	}
};