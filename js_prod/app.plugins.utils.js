// Update the interpolator to {{= }} instead of <? >
_.templateSettings = {
	evaluate	: /\{\{(.+?)\}\}/gim,
	interpolate	: /\{\{\=(.+?)\}\}/gim
};

app.plugins.json = {
	stringify: function (object) {
		return JSON.stringify(object).replace(/\"/gi, '|');
	},
	parse: function (string) {
		return JSON.parse(string.replace(/\|/gi, '"'));
	}
};

app.plugins.seconds_to_time = function (n) {
	var m = Math.floor(n / 60);
	var s = Math.floor(n % 60);
	var resp = ( ((m < 1) ? "0" : m) + ":" + ((s < 10) ? "0" + s.toString() : s) );
	return resp;
}


window.shouldRotateToOrientation = function(orientation) {
	var is_feed = (window.location.hash.indexOf('feed') > -1) ? true : false;
	
	if (is_feed) {
		var resize = _.debounce(function() {
			var orientation = (Math.abs(window.orientation) == 90) ? 'landscape' : 'portrait';
			app.trigger('orientation:trigger', orientation);
		}, 800);
		resize();
	} else {
		return false;
	}
};

function console_log(data) {
	console.log(data);
}

function silent_log(data) {
	// do nothing
}

function get_window_size() {
	var windowHeight = 0, windowWidth = 0;
	if (typeof (window.innerWidth) == 'number') {
		windowHeight = window.innerHeight;
		windowWidth = window.innerWidth;
	} else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
		windowHeight = document.documentElement.clientHeight;
		windowWidth = document.documentElement.clientWidth;
	} else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
		windowHeight = document.body.clientHeight;
		windowWidth = document.body.clientWidth;
	}
	return [windowWidth, windowHeight];
}

function to_title_case(str) {
    if (!_.isArray(str)) str = [str];
    
    var final = '';
    _.each(str, function(part) {
    	var resp = title(part);
    	final += (final == '') ? resp : ' ' + resp;
    });
    
    function title(str) {
    	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}
	
	return final;
}

app.plugins.title_case = to_title_case;

String.prototype.trunc = function (n, useWordBoundary) {
	var toLong = this.length > n,
	s_ = toLong ? this.substr(0,n-1) : this;
	s_ = useWordBoundary && toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
	return  toLong ? s_ + '&hellip;' : s_;
};