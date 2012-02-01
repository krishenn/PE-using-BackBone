define([
	'jquery',
	'underscore',
	'backbone',
	//template
	'text!templates/explore/topics.html',
	//view
	'views/topics/list'
], function($, _, Backbone, exploreTopicsTemplate, topicsListView) {
		var exploreTopicsView = Backbone.View.extend({
			collapsed: function() {
				this.mode = 'collapsed';
				this.render();
			},
			expanded: function() {
				this.mode = 'expanded';	
				this.render();
				//load topics data and view
				topicsListView.show();
			},
			render: function() {
				var compiledTemplate = _.template( exploreTopicsTemplate, [] );
				//create a temp container and put the compiled template in it so we can manipulate it
				var el = $("<div/>").append(compiledTemplate);
//console.log(el);				
				//read query string params
//console.log(this.params);					
				if (this.mode=='expanded') {
					//set tabs
					$('#topics_tabs', el).tabs();
					//set expanded params
					$("#topics", el).show();
					$("#topics_summary_expanded", el).show();
					$("#topics_summary_collapsed", el).hide();
				} else {
					//set summary params
					//figure out topics
					//set collapsed params
					$("#topics", el).hide();
					$("#topics_summary_expanded", el).hide();
					$("#topics_summary_collapsed", el).show();
				}
				//set collapsed params
				var compiledTemplate = el.html();
//console.log(compiledTemplate);				
				$(this.el).html(compiledTemplate);
//console.log($(this.el).html());
			}
		});
		return new exploreTopicsView;
});