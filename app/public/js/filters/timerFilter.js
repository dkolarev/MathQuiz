//timerFilter.js

function timerFilter () {
	return function(seconds) {
		var d = new Date(0,0,0,0,0,0,0);
        d.setSeconds(seconds);
        return d;
	};
};