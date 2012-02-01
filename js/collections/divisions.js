define([
	'underscore',
	'backbone',
	//division model
	'models/division'
], function(_,Backbone,divisionModel) {
	var divisionsCollection = Backbone.Collection.extend({
		model: divisionModel,
		url: function() { return apiurl+'topic?'+this.params+'&summ=org,status'+'&jsoncallback=?'; },
		parse: function(data) {
			//prepare data
			var rawdata = data["data"];
			//group by org
			var grouped = _.groupBy(rawdata,function(row) { return row["org"]; });
			//now assemble
			var summary = {};
			for (var org in grouped) {
				summary[org] = _.reduce(grouped[org],function(memo,row) {
					var count_awarded = 0;
					var count_declined = 0;
					var count_other = 0;
					var funding_awarded = 0;
					var funding_requested = 0;
					if (row["status"]=="award") {
						funding_awarded = row["awarded_dollar"];
						count_awarded = row["count"];
					} else if (row["status"]=="decline") {
						count_declined = row["count"];
					} else {
						count_other = row["count"];
					}
					if (row["request_dollar"]) funding_requested = row["request_dollar"];
					return {"count_awarded":memo["count_awarded"]+count_awarded,"count_declined":memo["count_declined"]+count_declined,"count_other":memo["count_other"]+count_other,"funding_awarded":memo["funding_awarded"]+funding_awarded,"funding_requested":memo["funding_requested"]+funding_requested};
				},{"count_awarded":0,"count_declined":0,"count_other":0,"funding_awarded":0,"funding_requested":0});
			}
			var collated = [];
			//now using the master list
			for (var org in divisions) {
				if (summary[org]) {
					var tmp = summary[org];
					tmp["org"] = org;
					tmp["title"] = divisions[org];
					tmp["directorate"] = directorates[org]==undefined?'Other':directorates[org];
					collated.push(tmp);
				}
			}
//console.log(collated);	
			//sort by title
			//collated = _.sortBy(collated,function(row) { return row["title"]; });
			return collated;
		}
	})
	// You usually don't return a collection instantiated
	return divisionsCollection;
});