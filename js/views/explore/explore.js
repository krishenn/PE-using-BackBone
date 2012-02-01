define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/explore/explore.html',
	//query
	'views/explore/query',
	//topics
	'views/explore/topics',
	//results
	'views/explore/results',
], function($, _,Backbone,exploreExploreTemplate,exploreQueryView,exploreTopicsView,exploreResultsView) {
	var pageExploreView = Backbone.View.extend({
		el: $('#main'),
		events: {
			"click #explore_queryform_submit_topics": "queryformSubmit",
			"click #explore_queryform_summary_change": "queryformChange",
			"click a[id^=explore_topics_submit]": "showResults"
		},
		show: function(page,tab,params) {
//console.log(page);			
console.log(params);
			var self = this;
			require([
			  'order!js/libs/jquery-ui/jquery-ui-1.8.14.custom.min.js',
			], function(){	
				if (page==''||page==undefined) page='query';
				if (tab==''||tab==undefined) tab='awards';

				self.render();
				//load components
				//compile query
				exploreQueryView.el = $('#query_container'); //not this.
				//pass along the params
				exploreQueryView.params = params;
				//re bind events
				exploreQueryView.delegateEvents();
				if (page=='query') exploreQueryView.expanded();
	/*				//set queryform
					var compiledTemplate = _.template($('#pages_explore_queryform_template').html(), [] );
		//console.log(compiledTemplate);			
					$('#queryform_container', this.el).html(compiledTemplate);
				}*/
				else exploreQueryView.collapsed();
				//compile topics
				exploreTopicsView.el = $('#topics_container'); //not this.
				//pass along the params
				exploreTopicsView.params = params;
				if (page=='topics') exploreTopicsView.expanded();
				else exploreTopicsView.collapsed();
	//console.log(compiledTemplate_Topics);			
				//compile results
				exploreResultsView.el = $('#results_container'); //not this.
				//pass along the params
				exploreResultsView.params = params;
				//and the tab
				exploreResultsView.tab = tab;
				if (page=='results') exploreResultsView.expanded();
				else exploreResultsView.collapsed();
				//set downstream elements 
				
			});
		},
		render: function() {
//console.log(compiledTemplates);			
			// Compile the template using Underscores micro-templating
			var compiledTemplate = _.template(exploreExploreTemplate, [] );
//console.log(compiledTemplate);			
			this.el.html(compiledTemplate);
		},
		/* queryform submit - load topics
			hide queryform
			set querysummary
			show querysummary
			load topics
			show topics
		*/
		queryformSubmit: function(event) {
			event.preventDefault();
			var el = event.currentTarget;
			//query params
			var params = {'year':'2005','org':'CHE'};
			var queryparams = _.map(params, function(value,key) {
				return key+'='+value;
			});
//console.log(queryparams);			
//return false;			
			var route = '/explore/topics/';
			if (queryparams) route += '?'+queryparams.join('&');
console.log(route);			
			//redirect - don't do this, see below
			//app_router.navigate(route, true);
			//this is more appropriate, second param false by default
			app_router.navigate(route); //simply update browser history
			this.show('topics','awards',queryparams.join('&'));
			
			return false;
		},
		/** querysummary **/
		/* change selection click
			hide querysummary
			hide topics
			hide topicsummary
			hide data
			show queryform
		*/
		queryformChange: function(event) {
			event.preventDefault();
			var el = event.currentTarget;
			//query params
			var params = {'year':'2005','org':'CHE','t':'763'};
			var queryparams = _.map(params, function(value,key) {
				return key+'='+value;
			});
			//redirect
			var route = '/explore/query/';
			if (queryparams) route += '?'+queryparams.join('&');
			//redirect - don't do this, see below
			//app_router.navigate("/explore/query/", true);
			//this is more appropriate, second param false by default
			app_router.navigate(route); //simply update browser history
			this.show('results','awards',queryparams.join('&'));

			return false;
		},
		/* showresults buttons click
			one or more topics must be selected
			hide topics
			set topicsummary
			show topicsummary
			load data (based on target tab i.e. proposals, awards, researchers, institutions
			show data
		*/
		showResults: function(event) {
			event.preventDefault();
			var el = event.currentTarget;
			//determine tab to show (in id of link, separate by _ and use last slice)
			var tab = $(el).attr('id').split('_').pop();
			//query params
			var params = {'year':'2005','org':'CHE','t':'763'};
			var queryparams = _.map(params, function(value,key) {
				return key+'='+value;
			});
			//redirect
			var route = '/explore/results/'+tab+'/';
			if (queryparams) route += '?'+queryparams.join('&');
			//redirect - don't do this, see below
			//app_router.navigate("/explore/results/"+tab, true);
			//this is more appropriate, second param false by default
			app_router.navigate(route); //simply update browser history
			this.show('results',tab,queryparams.join('&'));
			return false;			
		}
	});
	// Returning instantiated views can be quite useful for having "state"
	return new pageExploreView;
});