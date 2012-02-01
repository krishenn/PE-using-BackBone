define([
	'jquery',
	'underscore',
	'backbone',
	//query
	'views/patents/query',
	//topics
	'views/patents/classes',
	//results
	'views/patents/results',
	//template
	'text!templates/patents/explore.html'
], function ($, _, Backbone, patentsQueryView, patentsClassesView, patentsResultsView, patentsExploreTemplate) {
	var patentsExploreView = Backbone.View.extend({
		el: $('#main'),
		events: {
			"click #patents_queryform_submit_topics": "queryformSubmit",
			"click #patents_queryform_summary_change": "queryformChange",
			"click a[id^=patents_classes_submit]": "showResults"
		},
		show: function(page,params) {
//console.log(page);			
//console.log(params);
			var self = this;
			require([
			  'order!js/libs/jquery-ui/jquery-ui-1.8.14.custom.min.js',
			], function(){	
				if (page==''||page==undefined) page='query';

				//load classes legend
				$.getJSON(apiurl+'patent?legend=class'+'&jsoncallback=?', function(data) {
					_.each(data, function(item) {
						legend_classes[item["class"]] = item["label"];
					});
					self.render();
console.log(page);				
	//console.log('params:'+params);				
					//load components
					//compile divisions
					patentsQueryView.el = $('#query_container'); //not this.				
					//pass along the params
					patentsQueryView.params = params;
					//re bind events
					patentsQueryView.delegateEvents();
					if (page=='query') patentsQueryView.expanded();
					else patentsQueryView.collapsed();
					//compile classes
					patentsClassesView.el = $('#classes_container'); //not this.
					//pass along the params
					patentsClassesView.params = params;
					if (page=='classes') patentsClassesView.expanded();
					else patentsClassesView.collapsed();
		//console.log(compiledTemplate_Topics);			
					//compile results
					patentsResultsView.el = $('#results_container'); //not this.
					//pass along the params
					patentsResultsView.params = params;
					if (page=='results') patentsResultsView.expanded();
					else patentsResultsView.collapsed();
					//set downstream elements 

				});			
			});
		},
		render: function() {
//console.log(compiledTemplates);			
			// Compile the template using Underscores micro-templating
			var compiledTemplate = _.template(patentsExploreTemplate, [] );
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
			var params = {'year':'2005-2010','org':'CHE'};
			var queryparams = _.map(params, function(value,key) {
				return key+'='+value;
			});
//console.log(queryparams);			
//return false;			
			var route = '/patents/classes/';
			if (queryparams) route += '?'+queryparams.join('&');
console.log(route);			
			//redirect - don't do this, see below
			//app_router.navigate(route, true);
			//this is more appropriate, second param false by default
			app_router.navigate(route); //simply update browser history
			this.show('classes',queryparams.join('&'));

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
			var params = {'year':'2005-2010','org':'CHE'};
			var queryparams = _.map(params, function(value,key) {
				return key+'='+value;
			});
//console.log(queryparams);			
//return false;			
			var route = '/patents/query/';
			if (queryparams) route += '?'+queryparams.join('&');
console.log(route);			
			//redirect - don't do this, see below
			//app_router.navigate(route, true);
			//this is more appropriate, second param false by default
			app_router.navigate(route); //simply update browser history
			this.show('query',queryparams.join('&'));

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

			//query params
			var params = {'year':'2005-2010','org':'CHE'};
			var queryparams = _.map(params, function(value,key) {
				return key+'='+value;
			});
//console.log(queryparams);			
//return false;			
			var route = '/patents/results/';
			if (queryparams) route += '?'+queryparams.join('&');
console.log(route);			
			//redirect - don't do this, see below
			//app_router.navigate(route, true);
			//this is more appropriate, second param false by default
			app_router.navigate(route); //simply update browser history
			this.show('results',queryparams.join('&'));

			return false;			
		}
	});
	
	return new patentsExploreView;
});