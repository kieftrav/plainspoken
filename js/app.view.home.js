app.views.Home_View = Backbone.View.extend({
	initialize: function (d) {
		this.listenTo(app.collection, 'all', this.render);
		this.template = d.template;
		this.render();
		
		return this;
	},
	render: function () {
		$(this.el).html(this.template({ articles: app.collection.toJSON() }));
		return this;
	}
});
