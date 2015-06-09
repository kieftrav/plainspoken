app.model.article = Backbone.Model.extend({
	defaults: {
		id			: false,
		author		: 'Author',
		date		: 'Date',
		title		: 'Title',
		sub_title	: 'Sub Title',
		text		: 'Text Collection',
		img			: 'img/logo.png'
	}
});
