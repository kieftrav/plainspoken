/*
	# https://github.com/hammerjs/hammer.js/wiki/Getting-Started
	hold, tap, doubletap, drag, dragstart, dragend, dragup, dragdown, dragleft, dragright, swipe, swipeup, swipedown, swipeleft, swiperight
	transform, transformstart, transformend, rotate, pinch, pinchin, pinchout, touch, release, gesture
*/


var Base_View = Backbone.View.extend({
	initialize: function () {
		var self = this;
		
		this.listenTo(app,	'orientation:trigger',	this.orientation);
		this.listenTo(app,	'change:route',			this.setup_page);
				
		$(document).on('keyup', function(e) {
			if (e.keyCode == 34)	self.right();
			if (e.keyCode == 39)	self.right();
			if (e.keyCode == 40)	self.right();
			
			if (e.keyCode == 33)	self.left();
			if (e.keyCode == 37)	self.left();
			if (e.keyCode == 38)	self.left();
		});
		
		_.each(app.plugins, function(plugin, plugin_name) {
			if (_.isObject(plugin) && plugin.initialize)
				plugin.initialize();
		});
				
		var throttled = _.throttle(self.detect_scroll, 500);
		$('#content').on('scroll', throttled);
		
		// Fill from local
		app.collection.add(app.data);
		
		/* Fill from database
		app.plugins.fetch({ _type: 'POST', endpoint: 'database', query: 'SELECT * FROM plainspoken' }, function(resp) {
			_.each(resp.result.rows, function(row) {
				var d	= JSON.parse(row.json);
				d.id	= row.id;
				app.collection.add(d);
			});
		});
		*/ 
		
		this.render();

		return this;
	},
	hammerEvents: {
		'swipeleft		.body'					: 'left',
		'swiperight		.body'					: 'right',
		'swipedown		.body'					: 'down',
		'swipeup		.body'					: 'up',
		'scroll			.body'					: 'detect_scroll',
		'touch			.body'					: '_touch',
		'drag			.body'					: '_drag',
		'dragstart		.body'					: '_start',
		'dragend		.body'					: '_release',
		
		'tap			.navlink'				: 'navlink_click',
		'tap			.right'					: 'left',
		'tap			.left'					: 'right',
		'tap			.data_trigger'			: 'process_trigger',
	},
	_drag: function (e) {
		app.trigger('events:raw',		e);
		app.trigger('events:drag',		e);
	},
	_touch: function (e) {
		app.trigger('events:touch',		e);
	},
	_start: function (e) {
		app.trigger('events:raw',		e);
		app.trigger('events:start',		e);
	},
	_release: function (e) {
		app.trigger('events:raw',		e);
		app.trigger('events:release',	e);
	},
	process_trigger: function (e) {		
		var trigger	= $(e.currentTarget).attr('data-trigger');
		var message	= $(e.currentTarget).attr('data-message');
		
		if (message && message.indexOf('{') == 0)
			message = app.plugins.json.parse(message);
		
		app.trigger(trigger, message);
		
		return this.gesture_default(e);
	},
	detect_scroll: function (e) {
		// use app.base because sometimes we have the wrong context
		app.base.drag(e);
		app.trigger('scroll');
	},
	_orientation: 'portrait',
	orientation: function (orientation) {
		if (this._orientation == orientation) return false; // do nothing if it's the same
		this._orientation = orientation;
		app.trigger('orientation:change', orientation);
	},
	hammerOptions: {
		tap: true
	},
	gesture_default: function (e) {
		e.preventDefault();
		e.gesture.preventDefault();
		return false;
	},
	drag: function(e) {
		if (!e.gesture)	return false;
		if (e.gesture.direction == 'right') this.right();
		if (e.gesture.direction == 'left')	this.left();
	},
	navlink_click: function(e) {
		app.router.navigate($(e.currentTarget).attr('href'), true);
	},
	up: function(e) {
		// do nothing
	},
	down: function(e) {
		// do nothing
	},
	left: function(e) {
		app.trigger('swipe:left');
		window.history.forward();
	},
	right: function(e) {
		app.trigger('swipe:right');
		window.history.back();
	},
	_pages			: [],
	_current_page	: false,
	setup_page: function (page_data) {
		// { page: '', id: '' }

		var page_view	= app.views.Page_View;
		var height		= get_window_size()[1];
		var prev 		= this._pages[this._current_page - 1];
		var next 		= this._pages[this._current_page + 1];
		
		var opts = {
			page		: page_data.page,
			id			: page_data.id,
			page_num	: this._current_page,
			content		: 'Loading',
			prev		: false,
			next		: false,
			height		: height			
		};
		
		if (this._pages.length == 0) {
			this._current_page	= 0;
			opts.page_num		= this._current_page;
			var page			= new app.views.Page_View(opts);
			this._pages[this._current_page] = page;
			$('#pages').append(page.el);

		} else if (prev && prev.options.page == page_data.page && prev.options.id == page_data.id) {	// show previous page
			this._pages[this._current_page].right();
			this._pages[this._current_page - 1].show();
			this._current_page--;
		} else if (next && next.page == page_data.page && next.id == page_data.id) {					// show next page that already exists
			this._pages[this._current_page].left();
			this._pages[this._current_page + 1].show();
			this._current_page++;
		} else {
			this._pages[this._current_page].left();
			this._current_page++;
			_.extend(opts, { prev: true, page_num: this._current_page });
			var new_page = new app.views.Page_View(opts);
			$('#pages').append(new_page.el);
			this._pages[this._current_page] = new_page;
		}
	},
	reset_view: function () {
		if (this.current_view) {
			this.current_view.remove();
			delete this.current_view;
		}
	},
	render: function () {
		this.reset_view();
		
		FastClick.attach(document.body);
		
		// Setup pseudo-links to prevent unnecessary DOM elements
		$(document).on('click', '.pseudo-link', function() {
			var navigate = $(this).attr('data-navigate');
			var location = $(this).attr('data-location');
			
			if (navigate == 'false')		Backbone.history.loadUrl(location);
			else							app.router.navigate(location, true);
		});
		
		return this;
	}
});
