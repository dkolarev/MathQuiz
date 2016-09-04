//enumData.js

function enumData() {

	var fieldEnum = [
		"calculus", 
		"algebra", 
		"number theory", 
		"numeric mathematic",
		"analitic geometry",
		"elementary geometry",
		"elementary mathematics",
		"computer science",
		"propability",
		"statistic"
	];

	var difficultyEnum = [
		"easy",
		"intermediate",
		"hard"
	];

	var ratingEnum = [
		1,2,3,4,5
	];

	var gameStatusEnum = {
		pendingStatus: 'waiting for players',
		playingStatus: 'playing',
		endStatus: 'ended'
	};

	var scoringEnum = ['difficulty', 'time'];

	return {
		fieldEnum: fieldEnum,
		difficultyEnum: difficultyEnum,
		ratingEnum: ratingEnum,
		gameStatusEnum: gameStatusEnum,
		scoringEnum: scoringEnum
	};
}