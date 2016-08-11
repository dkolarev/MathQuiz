//paginationFilter.js

function paginationFilter() {
	return function (data, start) {
		return data.slice(start);
	};
}