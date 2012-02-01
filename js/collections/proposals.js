define([
	'underscore',
	'backbone',
	//proposal model
	'models/proposal'
], function(_,Backbone,proposalModel) {
	var proposalsCollection = Backbone.Collection.extend({
		model: proposalModel,
		url: function() { 
			var page = "grant";
			/*if (tab=="awards") this.params += '&status=award';
			else if (tab=="declines") this.params += '&status=decline';
			else if (tab=="proposed") this.params += '&status=propose';*/
			
			return apiurl+'topic?'+this.params+'&page='+page+'&jsoncallback=?'; 
		},
		parse: function(data) {
			return data["data"];
		}
	});
	// You usually don't return a collection instantiated
	return proposalsCollection;
});