define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/patents/results.html',
	'views/patents/list'
], function($, _,Backbone,patentsResultsTemplate,patentsListView) {
	var patentResultView = Backbone.View.extend({
		collapsed: function() {
			this.mode = 'collapsed';
			this.render();
		},
		expanded: function() {
			this.mode = 'expanded';		
console.log(this.params);
			this.render();
			//set the params
			patentsListView.params = this.params;
			patentsListView.show();
		},
		render: function() {
			var compiledTemplate = _.template( patentsResultsTemplate, [] );
			//create a temp container and put the compiled template in it so we can manipulate it
			var el = $("<div/>").append(compiledTemplate);
//console.log(el);				
			if (this.mode=='expanded') {
//console.log(this.collection.models);	
				//engage ui tabs for data tabs
				$('#data_tabs', el).tabs();
				
				//set expanded params
				$("#data_container", el).show();
			} else {
				//set collapsed params
				$("#data_container", el).hide();
			}
			//set collapsed params
			var compiledTemplate = el.html();
//console.log(compiledTemplate);				
			$(this.el).html(compiledTemplate);
//console.log($(this.el).html());
		}
	});
	// Returning instantiated views can be quite useful for having "state"
	return new patentResultView;
});