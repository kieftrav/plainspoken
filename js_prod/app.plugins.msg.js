app.plugins.msg = {
	initialize: function () {
		this.listenTo(app, 'notifications:alert',		this.alert);
		this.listenTo(app, 'notifications:prompt',		this.prompt);
		this.listenTo(app, 'notifications:confirm',		this.confirm);
		this.listenTo(app, 'notifications:notify',		this.notify);
	},
	alert: function (message, btn_text) {
		window.alert(message);
	},
	prompt: function (placeholder, cb, title, buttons) {
		//don't use placeholder or buttons
		var response = window.prompt(title);
		
		var buttonIndex = (response == null) ? 1 : 0;
		
		cb({ buttonIndex: buttonIndex, input1: response });
	},
	confirm: function (data) {
		/*
		var confirm_data = {
			title	: 'Remove Funny?',
			message	: 'Are you sure you want to remove this item from the collection? Once removed, this cannot be undone.',
			confirm	: 'Yes - Remove!',
			success	: on_success,
			cancel	: on_cancel
		};
		*/

		var result = window.confirm(data.title);
		return (result == true) ? data.success() : data.cancel();
	},
	// app.plugins.msg.notify('New funny from ' + data.from, 'funny/' + data.funny_id);
	notify: function (msg, url) {
		$('#notification').html('<p class="center no-stuffing">' + msg + '</p>');
		
		if (url) {
			Hammer('#notification').on('tap', function () {
				app.router.navigate(url, true);
			});
		}
		
		move('#notification')
			.set('-webkit-transform', 'translate3d(0, 0px, 0)')
			.delay('0s')
			.duration('.5s')
			.then()
				.delay('1.5s')
				.set('-webkit-transform', 'translate3d(0, -100px, 0)')
				.duration('.5s')
				.pop()
			.end();
	}
};

_.extend(app.plugins.msg, Backbone.Events);
	