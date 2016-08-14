//quizDataValidator.js

var validateTitle = function (title) {
	if (typeof title === "undefined") return false;
	if (typeof title !== "string") return false;
	if (title === "") return false;

	return true;
}

var validateDescription = function (description) {
	if (typeof description === "undefined") return false;
	if (typeof description !== "string") return false;
	if (description === "") return false;

	return true;
}

var validateField = function (field) {
	if (typeof field === "undefined") return false;
	if (typeof field !== "string") return false;
	if (field === "") return false;

	return true;
}

var validateCreatedBy = function (createdBy) {
	if (typeof createdBy === "undefined") return false;
	if (typeof createdBy !== "string") return false;
	if (createdBy === "") return false;

	return true;
}

var validateQuiz = function(quiz) {
	if (!validateTitle(quiz.title)) return false;
	if (!validateDescription(quiz.description)) return false;
	if (!validateField(quiz.field)) return false;
	if (!validateCreatedBy(quiz.createdBy)) return false;

	return true;
}

module.exports = {
	validateTitle: validateTitle,
	validateDescription: validateDescription,
	validateField: validateField,
	validateCreatedBy: validateCreatedBy,
	validateQuiz: validateQuiz
};