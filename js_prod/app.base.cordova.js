// @user

function setup_platforms() {
	// Device type stuff
	var platforms = {
		'Android'		: true,
		'BlackBerry'	: true,
		'iOS'			: true,
		'webOS'			: true,
		'WinCE'			: true
	};
	
	//user.set('platform', device.platform);
	$('body').addClass(device.platform);
	
	// Network Details
	var networkState = navigator.connection.type;
	
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
	
	if (states[networkState] == 'Unknown connection') {
	    //when_offline();
	}
	
	app.plugins.msg.alert = function(message, button) {
		button = button || 'Ok';
		window.navigator.notification.alert('', function() {}, message, button);
	}
	
	app.plugins.msg.confirm = function(data) {
		function on_click(button) {
			// 1 is cancel, 2 is accept
			return (button == 1) ? data.cancel() : data.success();
		}
		
		window.navigator.notification.confirm(data.message, on_click, data.title, 'Cancel,' + data.confirm);
	}
	
	app.plugins.msg.prompt = function(placeholder, cb, title, buttons) {
		navigator.notification.prompt(placeholder, cb, title, buttons);
	}
};

function when_offline(data) {
	app.router.navigate('offline', true);
}

function when_online(data) {
	//user.check_login_status();
}

function setup_cordova() {
	document.addEventListener("offline", when_offline, false);
	document.addEventListener("online", when_online, false);
	
	setup_platforms();
	app.setup();
}

document.addEventListener("deviceready", setup_cordova, false);
