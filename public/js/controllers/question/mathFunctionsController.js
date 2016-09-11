//mathFunctionsController.js

function mathFunctionsController($scope) {

	$scope.onClickText = function(newQuestion) {
		if(question.description) {
			question.description = "\\text{}";
		} else {
			question.description = question.description + " \\text{}";
		}
	}

	$scope.onClickSum = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\sum_";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\sum_";
		}
	};

	$scope.onClickProduct = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\prod_";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\prod_";
		}
	};

	$scope.onClickSqrt = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\sqrt{}";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\sqrt{}";
		}
	};

	$scope.onClickIntegral = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\int_";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\int_";
		}
	};

	$scope.onClickLim = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\lim_";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\lim_";
		}
	};

	$scope.onClickLimInf = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\liminf";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\liminf";
		}
	};

	$scope.onClickLimSup = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\limsup";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\limsup";
		}
	};

	$scope.onClickInf = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\inf";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\inf";
		}
	};

	$scope.onClickSup = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\sup";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\sup";
		}
	};

	$scope.onClickLn = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\ln";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\ln";
		}
	};

	$scope.onClickLog = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\log";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\log";
		}
	};

	$scope.onClickExp = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\exp";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\exp";
		}
	};	

	$scope.onClickFrac = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\frac{}{}";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\frac{}{}";
		}
	};

	$scope.onClickSin = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\sin";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\sin";
		}
	};

	$scope.onClickCos = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\cos";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\cos";
		}
	};

	$scope.onClickTan = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\tan";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\tan";
		}
	};

	$scope.onClickCot = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\cot";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\cot";
		}
	};

	$scope.onClickArcSin = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\arcsin";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\arcsin";
		}
	};

	$scope.onClickArcCos = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\arccos";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\arccos";
		}
	};

	$scope.onClickArcTan = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\arctan";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\arctan";
		}
	};

	$scope.onClickGamma = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\Gamma";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\Gamma";
		}
	};

	$scope.onClickDelta = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\Delta";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\Delta";
		}
	};

	$scope.onClickTheta = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\Theta";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\Theta";
		}
	};

	$scope.onClickLambda = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\Lambda";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\Lambda";
		}
	};

	$scope.onClickPi = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\Pi";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\Pi";
		}
	};

	$scope.onClickSigma = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\Sigma";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\Sigma";
		}
	};

	$scope.onClickPhi = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\Phi";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\Phi";
		}
	};

	$scope.onClickPsi = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\Psi";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\Psi";
		}
	};

	$scope.onClickOmega = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\Omega";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\Omega";
		}
	};

	$scope.onClickLittleAlpha = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\alpha";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\alpha";
		}
	};

	$scope.onClickLittleBeta = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\beta";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\beta";
		}
	};

	$scope.onClickLittleGamma = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\gamma";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\gamma";
		}
	};

	$scope.onClickLittleDelta = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\delta";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\delta";
		}
	};

	$scope.onClickLittleEpsilon = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\epsilon";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\epsilon";
		}
	};

	$scope.onClickLittleEta = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\eta";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\eta";
		}
	};

	$scope.onClickLittleTheta = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\theta";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\theta";
		}
	};

	$scope.onClickLittleLambda = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\lambda";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\lambda";
		}
	};

	$scope.onClickLittleMu = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\mu";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\mu";
		}
	};

	$scope.onClickLittlePi = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\pi";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\pi";
		}
	};

	$scope.onClickLittleRho = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\rho";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\rho";
		}
	};

	$scope.onClickLittleSigma = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\sigma";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\sigma";
		}
	};

	$scope.onClickLittleTau = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\tau";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\tau";
		}
	};

	$scope.onClickLittlePhi = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\phi";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\phi";
		}
	};

	$scope.onClickLittleChi = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\chi";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\chi";
		}
	};

	$scope.onClickLittlePsi = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\psi";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\psi";
		}
	};

	$scope.onClickLittleOmega = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\omega";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\omega";
		}
	};

	$scope.onClickNSqrt = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\sqrt[n]{}";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\sqrt[n]{}";
		}
	};

	$scope.onClickBigCap = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\bigcap";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\bigcap";
		}
	};

	$scope.onClickBigCup = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\bigcup";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\bigcup";
		}
	};

	$scope.onClickOr = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\bigvee";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\bigvee";
		}
	};

	$scope.onClickAnd = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\bigwedge";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\bigwedge";
		}
	};

	$scope.onClickIsElement = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\in";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\in";
		}
	};

	$scope.onClickDollar = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "$$";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " $$";
		}
	};

	$scope.onClickDoubleDollar = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "$$$$";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " $$$$";
		}
	};

	$scope.onClickForAll = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\forall";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\forall";
		}
	};

	$scope.onClickExist = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\exists";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\exists";
		}
	};

	$scope.onClickSubset = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\subseteq";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\subseteq";
		}
	};

	$scope.onClickSubseteq = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\subset";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\subset";
		}
	};

	$scope.onClickLeq = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\leq";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\leq";
		}
	};

	$scope.onClickGeq = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\geq";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\geq";
		}
	};

	$scope.onClickEquiv = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\equiv";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\equiv";
		}
	};

	$scope.onClickSim = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\sim";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\sim";
		}
	};

	$scope.onClickAprox = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\approx";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\approx";
		}
	};

	$scope.onClickCong = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\cong";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\cong";
		}
	};

	$scope.onClickNeq = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\neq";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\neq";
		}
	};

	$scope.onClickEmptySet = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\emptyset";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\emptyset";
		}
	};

	$scope.onClickInfinity = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\infty";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\infty";
		}
	};

	$scope.onClickNabla = function() {
		if(!$scope.newQuestion.description) {
			$scope.newQuestion.description = "\\nabla";
		} else {
			$scope.newQuestion.description = $scope.newQuestion.description + " \\nabla";
		}
	};
};