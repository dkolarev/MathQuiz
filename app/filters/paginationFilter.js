//paginationFilter.js

module.exports = function(list, itemsPerPage, pageNumber) {
	return list.slice((pageNumber - 1) * itemsPerPage, pageNumber * itemsPerPage);
};