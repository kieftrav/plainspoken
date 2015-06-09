var Base_Router = Backbone.Router.extend({
	initialize: function() {
		this.listenTo(app, 'notification', this.on_notification);
	},
	routes: {
		'*path'						:	'page',
		'*path/:id'					:	'page'
	},
	on_notification: function (data) {
		if (data.type == 'msg') {
			app.plugins.msg.notify(data.msg);
		} else {
			app.plugins.msg.notify(data.text);
		}
	},
	page: function(page, id) {
		if (!page) page = 'home';
		
		if (page.indexOf('/') > -1) {
			var s	= page.split('/');
			page	= s[0];
			id		= s[1];
		}
		
		app.trigger('change:route', { page: page, id: id });
	}
});
