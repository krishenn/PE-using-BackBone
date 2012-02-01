define([
	'jquery',
	'underscore',
	'backbone',
	//topics collection
	'collections/patents',
	//template
	'text!templates/patents/classes.html'
], function($, _, Backbone, patentsCollection, patentsClassesTemplate) {
		var patentsClassesView = Backbone.View.extend({
			initialize: function() {
				_.bindAll(this, 'render'); //you must do this to trap bound events
				this.collection = new patentsCollection;
				//bind
				this.collection.bind("reset", this.render);
			},
			collapsed: function() {
				this.mode = 'collapsed';
				this.render();
			},
			expanded: function() {
				this.mode = 'expanded';	
				//pass along the params
				this.collection.params = this.params;
console.log(this.collection.params);				
				var self = this;
				require([
				  'order!js/libs/datatables/media/js/jquery.dataTables.min.js',
				  'order!js/libs/jquery-ui/jquery-ui-1.8.14.custom.min.js',
				  'order!js/libs/tabletools/media/js/TableTools.js',
				  'order!js/libs/tabletools/media/js/ZeroClipboard.js'
				], function(){	
					self.collection.fetch();
				});
			},
			render: function() {
				var compiledTemplate = _.template( patentsClassesTemplate, [] );
				//create a temp container and put the compiled template in it so we can manipulate it
				var el = $("<div/>").append(compiledTemplate);
//console.log(el);				
				//read query string params
//console.log(this.params);					
				if (this.mode=='expanded') {
					var collated = [];
					//now using the master list
					for (var patentclass in legend_classes) {
						var found = _.filter(this.collection.models, function(model) {
							return ($.inArray(patentclass,model["attributes"]["classes"])!=-1);
						});
//console.log(found);						
						if (found.length>0) {
							var tmp = {};
							tmp["class"] = patentclass;
							tmp["title"] = legend_classes[patentclass];
							tmp["count"] = found.length;
							collated.push(tmp);
						}
					}
					
					//download 
					//prepare for datatable data - conv to array
					var aaData = _.map(collated, function(row) {
						return [row["class"], row["title"], row["count"]];
					});
//console.log(aaData);		

					var oTable = $('#classes_table', el).dataTable({
						//TableTools - copy, csv, print, pdf
						"bJQueryUI": true,
						"sPaginationType": "full_numbers",
						//"sDom": 'T<"clear">lfrtip',
						//"sDom": 'T<"clear"><"H"lfr>t<"F"ip>',
				        "oTableTools": {
				            "aButtons": [
				                {
				                    "sExtends":    "collection",
				                    "sButtonText": "Export as CSV",
				                    "aButtons":    [ "csv" ]
				                }
				            ]
				        },
						"bDestroy": true,
						"bProcessing": true,
						"bAutoWidth": false,
						"iDisplayLength": 50,
						"aaData": aaData,
						"aoColumnDefs": [
							{
								"fnRender": function ( oObj ) {
									return '<input type="checkbox" name="class[]" value="'+oObj.aData[0]+'">';
								},
								"sClass": "center",
								"bUseRendered": false,
								"bSearchable": false,
								"bSortable": false,
								"sTitle": "Select",
								"aTargets": [ 0 ]
							},
							{
								"sTitle": "Title",
								"aTargets": [ 1 ]
							},
							{
								"sTitle": "Count",
								"aTargets": [2]
							}/*,
							{
								"fnRender": function ( oObj ) {
									return '<a id="class_details_'+oObj.aData[0]+'" class="show-details">Show</a>';
								},
								"bSearchable": false,
								"bSortable": false,
								"aTargets": [ 3 ]
							}*/
						],
						"aaSorting": [[2, 'desc']],
						"oLanguage": {
							"sLengthMenu:": "Display _MENU_ records per page",
							"sSearch": "Keyword Filter:"
						}
					});

					//set tabs
					$('#classes_tabs', el).tabs();
					
					//set expanded params
					$("#classes", el).show();
					$("#classes_summary_expanded", el).show();
					$("#classes_summary_collapsed", el).hide();
				} else {
					//set summary params
					//figure out topics
					//set collapsed params
					$("#classes", el).hide();
					$("#classes_summary_expanded", el).hide();
					$("#classes_summary_collapsed", el).show();
				}
				//set collapsed params
				var compiledTemplate = el.html();
//console.log(compiledTemplate);				
				$(this.el).html(compiledTemplate);
//console.log($(this.el).html());
			}
		});
		return new patentsClassesView;
});