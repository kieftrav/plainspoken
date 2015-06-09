var Base_Collection = Backbone.Collection.extend({
	model		: app.model.article,
	comparator	: 'title',
	search		: function () {
		
	}
});
