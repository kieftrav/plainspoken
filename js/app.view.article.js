app.views.Article_View = Backbone.View.extend({
	initialize: function (d) {
		_.extend(this, d);
		this.template = d.template;
		this.render();
		
		return this;
	},
	render: function () {
		var m = app.collection.get(this.id).toJSON();
		
		$(this.el).html(this.template(m));
		return this;
	}
});
