define([
	'jquery',
	'underscore',
	'backbone',
	//template
	'text!templates/patents/query.html',
	//divisions list view
	'views/divisions/list'
], function($, _, Backbone, patentsQueryTemplate, divisionsListView) {
		var exploreQueryView = Backbone.View.extend({
			collapsed: function() {
				this.mode = 'collapsed';
				this.render();
			},
			expanded: function() {
				this.mode = 'expanded';		
				this.render();
				//load divisions data and view
				divisionsListView.show();				
//console.log(this.params);						
			},
			render: function() {
				var compiledTemplate = _.template( patentsQueryTemplate, [] );
				//create a temp container and put the compiled template in it so we can manipulate it
				var el = $("<div/>").append(compiledTemplate);
//console.log(el);				
				if (this.mode=='expanded') {
//console.log(this.collection.models);
					//set the tabs
					$('#divisions_tabs', el).tabs();
//console.log($(this.el).html());					
					//set expanded params
					$("#queryform", el).show();
					$("#queryform_summary_expanded", el).show();
					$("#queryform_summary_collapsed", el).hide();
				} else {
					//set collapsed params
					$("#queryform", el).hide();
					$("#queryform_summary_expanded", el).hide();
					$("#queryform_summary_collapsed", el).show();
				}
				//set collapsed params
				var compiledTemplate = el.html();
//console.log(compiledTemplate);				
				$(this.el).html(compiledTemplate);
//console.log($(this.el).html());
			}
		});
		return new exploreQueryView;
});