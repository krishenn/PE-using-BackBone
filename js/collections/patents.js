define([
	'underscore',
	'backbone',
	// Pull in the Patent Model
	'models/patent'
], function(_,Backbone,patentModel) {
	var patentsCollection = Backbone.Collection.extend({
		model: patentModel,
		url: function() { return apiurl+'topic?'+this.params+'&page=patent'+'&jsoncallback=?'; },
		parse: function(data) {
			return data["data"];
		}
	});
	// You don't usually return a collection instantiated
	return patentsCollection;
});