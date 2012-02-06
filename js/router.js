define([
  'jquery',
  'underscore',
  'backbone',
  'views/pages/show',
  'views/explore/explore',
  'views/patents/explore'
], function($, _, Backbone, pagesShowView, exploreExploreView, patentsExploreView){
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      'pages/:page': 'showPage',
	  'explore/results/:tab/*params': 'explorePageResults',
	  'explore/:page/*params': 'explorePage',
	  'explore': 'explorePage',

	  'patents': 'explorePatents',
	  'patents/:page/*params': 'explorePatents',
	
      // Default
      '*actions': 'defaultAction' //using splats
    },
	//beware the zombies, do this
	//from here http://lostechies.com/derickbailey/2011/09/15/zombies-run-managing-page-transitions-in-backbone-apps/
	registerView: function(view) {
	    /*if (this.currentView){
//console.log('unloading');
//console.log(this.currentView);
	      this.currentView.close();
	    }*/

	    this.currentView = view;		
	},
    showPage: function(page){
      // Call render on the module we loaded in via the dependency array
      // 'views/pages/show'
console.log(page);
	   //beware the zombies, do this
	   //from here http://lostechies.com/derickbailey/2011/09/15/zombies-run-managing-page-transitions-in-backbone-apps/
	  this.registerView(pagesShowView);
      pagesShowView.render(page);
    },
	explorePage: function(page,params) {
//console.log(params);		
		params = this.processParams(params);
	   //beware the zombies, do this
	   //from here http://lostechies.com/derickbailey/2011/09/15/zombies-run-managing-page-transitions-in-backbone-apps/
	  this.registerView(exploreExploreView);
      // Call render on the module we loaded in via the dependency array
      // 'views/patents/explore'
	  exploreExploreView.show(page,params);
	},
	explorePageResults: function(tab,params) {
//console.log(params);		
		params = this.processParams(params);
 	   //beware the zombies, do this
	   //from here http://lostechies.com/derickbailey/2011/09/15/zombies-run-managing-page-transitions-in-backbone-apps/
	  this.registerView(exploreExploreView);
     // Call render on the module we loaded in via the dependency array
      // 'views/patents/explore'
	  exploreExploreView.show('results',tab,params);
	},
	explorePatents: function(page,params) {
//console.log(params);	
	   params = this.processParams(params);
	   //beware the zombies, do this
	   //from here http://lostechies.com/derickbailey/2011/09/15/zombies-run-managing-page-transitions-in-backbone-apps/
	  this.registerView(patentsExploreView);
      // Call render on the module we loaded in via the dependency array
      // 'views/patents/explore'
	  patentsExploreView.show(page,params);
	},
    defaultAction: function(actions){
	   //beware the zombies, do this
	   //from here http://lostechies.com/derickbailey/2011/09/15/zombies-run-managing-page-transitions-in-backbone-apps/
	  this.registerView(pagesShowView);
      // We have no matching route, show the home page
	  pagesShowView.render('home');
    },
    processParams: function(params) {
	  //strip out ? from beginning of string
	  if (params==undefined) params = '';
	  params = params.substring(1,params.length);
	
	  return params;
	}
  });

  var initialize = function(){
console.log('initializing router');
    app_router = new AppRouter;
    Backbone.history.start();
   //beware the zombies, do this
   //from here http://lostechies.com/derickbailey/2011/09/15/zombies-run-managing-page-transitions-in-backbone-apps/
	Backbone.View.prototype.close = function(){
	  /*this.remove();
	  this.unbind();
	  if (this.onClose){
	    this.onClose();
	  }*/
	}
  };
  return {
    initialize: initialize
  };
});