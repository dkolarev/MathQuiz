//ratingCalculator.js

/**
*	Racuna novi rating na osnovu starog na sljedeci nacin:
*
*	An+1 = An * n/(n+1) + an+1/(n+1)
*/
module.exports.calculateRating = function(oldRating, oldRatingCount, rating) {
	var newRatingCount = oldRating + 1;

	var newRating = oldRating * oldRatingCount/newRatingCount + rating/newRatingCount;

	return Math.round(newRating);
};