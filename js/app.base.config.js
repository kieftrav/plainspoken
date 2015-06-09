app.config = {
	env		: 'alpha',
	urls	: {
		alpha		: 'http://tk.me:1234/',
		testing		: 'http://api.sodo.co:1337/',
		beta		: 'http://api.sodo.co:1337/',
		prod		: 'http://api.sodo.co:1337/'
	},
	get_base_url: function () {
		return this.urls[this.env];
	},
	pushwoosh: {
		app_id				: '3D3F4-05E88',
		android_project_id	: '',
		auth_token			: 'nkM52v3uD5VL28Q3fmnk4fGSraba716pl1SAgC34GB2HOWMc7tBzEAHPGxaIdcmYf9hDNjTXdYixuyoQVvTn'
	}
};

//app.config.env = 'testing';

if (window.location.hostname == '')						app.config.env = 'prod';
