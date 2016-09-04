//questionDataValidator.js

var questionDifficultyEnum = require('./questionDifficultyEnum');

var elementOf = function(array, element) {
	var value = array.indexOf(element);
	if (value === -1) {
		return false;
	} else {
		return true;
	}
}


var validateTitle = function (title) {
	if (typeof title !== "undefined" && typeof title === "string") {
		return title !== "";
	}else {
		return false;
	}
}

var validateDescription = function (description) {
	if (typeof description !== "undefined" && typeof description === "string") {
		return  description !== "";
	} else {
		return false;
	}
}

var validateTime = function (time) {
	if (typeof time !== "undefined" && typeof time === "number") {
		return time > 0 && (time % 1 === 0);
	} else {
		return false;
	}
}

var validateCreatedBy = function(createdBy) {
	if (typeof createdBy !== "undefined" && typeof createdBy == "string") {
		return createdBy !== "";
	} else {
		return false;
	}
}

var validateDifficulty = function(difficulty) {
	if (typeof difficulty !== "undefined" && typeof difficulty == "string") {
		return difficulty !== "";
	} else {
		return false;
	}
}

var validateAnswer = function(answer) {
	if (typeof answer !== "undefined" && typeof answer === "string") {
		return answer !== "";
	} else {
		return false;
	}
}

var validateField = function(field) {
	if (typeof field !== "undefined" && typeof field === "string") {
		return field !== "";
	} else {
		return false;
	}
}


var validateAllAnswers = function(allAnswers) {
	if (Object.keys(allAnswers).length !== 4) return false;
	if (!validateAnswer(allAnswers.answer1)) return false;
	if (!validateAnswer(allAnswers.answer2)) return false;
	if (!validateAnswer(allAnswers.answer3)) return false;
	if (!validateAnswer(allAnswers.answer4)) return false;

	//ako je sve u redu vrati true
	return true;
}

var validateImage = function(image) {
	if (image == null) return true;

	var index = image.indexOf(":") + 1;
	var index_2 = index + 5;
	var sliced = image.slice(index, index_2);

	return sliced === "image";

} 

var validateQuestion = function(question) {
	if (!validateTitle(question.title)) return false;
	if (!validateDescription(question.description)) return false;
	if (!validateTime(question.time)) return false;
	if (!validateCreatedBy(question.createdBy)) return false;
	if (!validateDifficulty(question.difficulty)) return false;
	if (!validateAnswer(question.correctAnswer)) return false;
	if (!validateAllAnswers(question.allAnswers)) return false;
	if (!validateField(question.field)) return false;
	if (!validateImage(question.image)) return false;

	//ako je sve proslo u redu vrati true
	return true;
}


module.exports = {
	validateTitle: validateTitle,
	validateDescription: validateDescription,
	validateTime: validateTime,
	validateCreatedBy: validateCreatedBy,
	validateDifficulty: validateDifficulty,
	validateAnswer: validateAnswer,
	validateAllAnswers: validateAllAnswers,
	validateField: validateField,
	validateImage: validateImage,
	validateQuestion: validateQuestion
};