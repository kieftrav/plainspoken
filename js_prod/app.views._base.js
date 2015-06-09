Backbone.View.prototype.remove = function () {
	//this.$el.remove();
	
	function remove_subviews(array) {
		if (array.length == 0) return false;
		var subview = array.shift();
		subview.remove();
		remove_subviews(array);
	}
	
	if (this.subviews)	remove_subviews(this.subviews);
	
	this.on_remove();
	this.undelegateHammerEvents();
	this.stopListening();
	return this;
};

Backbone.View.prototype.subviews	= [];
Backbone.View.prototype.on_remove	= function () {};
Backbone.View.prototype.initialize	= function (options) { _.extend(this, options); this.render(); return this; }
Backbone.View.prototype.render		= function (options) { this.html(this.template(this)); return this; }
