define([
	'underscore',
	'backbone',
	//researcher model
	'models/researcher'
], function(_,Backbone,researcherModel) {
	var researchersCollection = Backbone.Collection.extend({
		model: researcherModel,
		url: function() { 
			var page = 'pi';
			var tmp = '';
			if ($('input[name=filter_status]:checked').val()=='completed') {
				tmp = 'award';
				if (proposalaccessallowed) tmp += ',decline';
		    } else if (proposalaccessallowed) {
				tmp += 'propose';
			}
			this.params += '&status='+tmp;
			
			return apiurl+'topic?'+this.params+'&page='+page+'&jsoncallback=?'; 
		},
		parse: function(data) {
			return data["data"];
		}
	});
	// You usually don't return a collection instantiated
	return researchersCollection;
});