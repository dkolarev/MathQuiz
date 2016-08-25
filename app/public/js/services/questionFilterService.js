//questionFilterService.js

function questionFilterService() {
	var filter = {
		currentPage: 1,
		pageItems: 10,
		fieldFilter: [],
		difficultyFilter: [],
		sortFilter: 'title',
		sortOrder: 1
	};

	var dateSort = function(filter) {
		if(filter.sortFilter === 'lastModified') {
			if(filter.sortOrder === 1) {
				filter.sortOrder = -1;
			} else {
				filter.sortOrder = 1;
			}
		} else {
			filter.sortFilter = 'lastModified';
			filter.sortOrder = 1;
		}

		return filter;
	};

	var nameSort = function(filter){
		if(filter.sortFilter === 'title') {
			if (filter.sortOrder === 1) {
				filter.sortOrder = -1;
			} else {
				filter.sortOrder = 1;
			}
		} else {
			filter.sortFilter = 'title';
			filter.sortOrder = 1;
		}

		return filter;
	};

	var clearFieldFilter = function(filter) {
		filter.fieldFilter = [];

		return filter;
	};

	var clearDifficultyFilter = function(filter) {
		filter.difficultyFilter = [];

		return filter;
	};


	return {
		filter: filter,
		dateSort: dateSort,
		nameSort: nameSort,
		clearFieldFilter: clearFieldFilter,
		clearDifficultyFilter: clearDifficultyFilter
	};
}