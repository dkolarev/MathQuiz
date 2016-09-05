//correctAnswerService.js

function correctAnswerService() {
	return {
		resetButtonsColors: function() {
			angular.element(document.querySelector("#button1"))
					.removeClass("btn-success");
			angular.element(document.querySelector("#button1"))
					.removeClass("btn-danger");

			angular.element(document.querySelector("#button2"))
					.removeClass("btn-success");
			angular.element(document.querySelector("#button2"))
					.removeClass("btn-danger");

			angular.element(document.querySelector("#button3"))
					.removeClass("btn-success");
			angular.element(document.querySelector("#button3"))
					.removeClass("btn-danger");

			angular.element(document.querySelector("#button4"))
					.removeClass("btn-success");
			angular.element(document.querySelector("#button4"))
					.removeClass("btn-danger");
		},

		setCorrectColor: function(correct, buttonId) {
			if (correct) {
				angular.element(document.querySelector("#" + buttonId))
					.addClass("btn-success");
			} else {
				angular.element(document.querySelector("#" + buttonId))
					.addClass("btn-danger");
			}
		}
	};
}