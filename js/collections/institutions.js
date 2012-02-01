define([
	'underscore',
	'backbone',
	//institution model
	'models/institution'
], function(_,Backbone,institutionModel) {
	var institutionsCollection = Backbone.Collection.extend({
		model: institutionModel,
		url: function() { 
			var page = 'org';
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
	return institutionsCollection;
});