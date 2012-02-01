define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){
  var pageView = Backbone.View.extend({
    el: $('#main'),
    render: function(page){
console.log(page);	
//		$('#main').html( 'HELLO!' );		
		require(['text!templates/pages/'+page+'.html'], function(template) {
//		console.log(template);	
			// Using Underscore we can compile our template with data
		    var data = {};
		    var compiledTemplate = _.template( template, data );
		    // Append our compiled template to this Views "el"
		    $('#main').html( compiledTemplate );		
	    });
		
/*	  var template = define('text!templates/pages/'+page+'.html');
console.log(template);	
      // Using Underscore we can compile our template with data
      var data = {};
      var compiledTemplate = _.template( template, data );
      // Append our compiled template to this Views "el"
      this.el.append( compiledTemplate );*/
    }
  });
  // Our module now returns an instantiated view
  // Sometimes you might return an un-instantiated view e.g. return projectListView
  return new pageView;
});

