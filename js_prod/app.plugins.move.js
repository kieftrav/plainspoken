app.plugins.move = function (options) {
	var obj = {
		hide: function () {
			this.move(this._hide);
		},
		show: function () {
			this.move(this._show);
		},
		set: function (num) {
			this.$el.css('-webkit-transform', 'translate3d(0px, ' + num + 'px , 0px)')
		},
		move: function (num, direction, cb) {
			cb = cb || function () {};
			
			var coors = '0px, ' + num + 'px , 0px';
			
			if (direction == 'horizontal')
				coors = num + 'px, 0px , 0px';
			
			move(this.el)
				.set('-webkit-transform', 'translate3d(' + coors + ')')
				.end(cb);
		}
	};
	
	obj.el		= options.el;
	obj.$el		= $(options.el);
	obj._show	= options.show || '0';
	obj._hide	= options.hide || '0';
	
	return obj;
}