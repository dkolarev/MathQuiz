//quizFilterService.js

function quizFilterService() {

	var initializeFilter = function(pageItems = 4) {
		return {
			currentPage: 1,
			pageItems: pageItems,
			fieldFilter: [],
			ratingFilter: [],
			sortFilter: 'title',
			sortOrder: 1
		};
	}

	var clearFieldFilter = function(filter) {
		filter.fieldFilter = [];

		return filter;
	};

	var clearRatingFilter = function(filter) {
		filter.ratingFilter = [];

		return filter;
	};

	return {
		initializeFilter: initializeFilter,
		clearFieldFilter: clearFieldFilter,
		clearRatingFilter: clearRatingFilter
	};
}