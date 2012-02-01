define([
	'jquery',
	'underscore',
	'backbone',
	//collections
	'collections/proposals',
	'collections/researchers',
	'collections/institutions',
	'text!templates/explore/results.html'
], function($, _,Backbone,proposalsCollection,researchersCollection,institutionsCollection,resultsExploreTemplate) {
	var resultExploreView = Backbone.View.extend({
		initialize: function() {
			_.bindAll(this, 'render'); //you must do this to trap bound events
		},
		collapsed: function() {
			this.mode = 'collapsed';
			this.render();
		},
		expanded: function() {
			this.mode = 'expanded';		
console.log(this.params);						
			var self = this;
			require([
			  'order!js/libs/datatables/media/js/jquery.dataTables.min.js',
			  'order!js/libs/jquery-ui/jquery-ui-1.8.14.custom.min.js',
			  'order!js/libs/tabletools/media/js/TableTools.js',
			  'order!js/libs/tabletools/media/js/ZeroClipboard.js'
			], function(){	
console.log(self.tab);				
				//figure out which collection to use
				if (self.tab=="awards"||self.tab=="declines"||self.tab=="proposed") {
					self.collection = new proposalsCollection;
				} else if (self.tab=="researchers") {
					self.collection = new researchersCollection;
				} else if (self.tab=="institutions") {
					self.collection = new institutionsCollection;
				}
				//pass along the params
				self.collection.params = self.params;
				//bind
				self.collection.bind("reset", self.render);					
				self.collection.fetch();
			});
		},
		render: function() {
			var compiledTemplate = _.template( resultsExploreTemplate, [] );
			//create a temp container and put the compiled template in it so we can manipulate it
			var el = $("<div/>").append(compiledTemplate);
//console.log(el);				
			if (this.mode=='expanded') {
//console.log(this.collection.models);					
				if (this.tab == "proposed") {
					var aaData = _.map(this.collection.models, function(v) { 
						return [
							v["attributes"]["proposal"]["nsf_id"],
							keyExists("request.dollar", v["attributes"], null),
							keyExists("request.date", v["attributes"], null),
							v["attributes"]["pge"]["code"], 
							v["attributes"]["org"]["name"],
							v["attributes"]["topic"]["id"].join(", ").replace(', ,', ""), 
							//v["status"]["name"],
						]; 
					});

					var oTable = $('#proposed_table', el).dataTable({
						//TableTools - copy, csv, print, pdf
						"bJQueryUI": true,
						"sPaginationType": "full_numbers",
						//"sDom": 'T<"clear">lfrtip',
						//"sDom": 'T<"clear"><"H"lfr>t<"F"ip>',
						"bDestroy": true,
						"bAutoWidth": false,
						"bProcessing": true,
						"iDisplayLength": 50,
						"aoColumnDefs": [
							{
								"sTitle": "Prop ID",
								"aTargets": [ 0 ]
							},
							{ 
								"fnRender": function ( oObj ) {
									return addCommas(oObj.aData[1]);
								},
								"bUseRendered": false,
								"sTitle": "Requested Amount",
								"aTargets": [ 1 ]
							},
							{ 
								"sTitle": "Request Date",
								"aTargets": [ 2 ] 
							}, 
							{ 
								"fnRender": function (oObj ) {
									return '<span id="pgecode_lookup_'+oObj.aData[3]+'">p'+oObj.aData[3]+'</span>';
								},
								"sTitle": "Prg. Elem. Code", 
								"aTargets": [ 3 ] 
							}, 
							{ "sTitle": "Division", "aTargets": [ 4 ] }, 
							{ 
								"fnRender": function ( oObj ) {
									var topics = oObj.aData[5].split(', ');
									var collated = _.map(topics, function(item) { if (legend_topics[item]) return 't'+item+':'+legend_topics[item]["label"]; else return 't'+item; });
									return collated.join(', ');
								},
								"sTitle": "Topics", 
								"aTargets": [ 5 ] 
							}
						],
						"aaData": aaData,
						"aaSorting": [[2, 'desc'], [0, 'desc']],
						"oLanguage": {
							"sLengthMenu:": "Display _MENU_ records per page",
							"sSearch": "Keyword Filter:"
						}
					});
				} else if (this.tab == "declines") {
					var aaData = _.map(this.collection.models, function(v) { 
						return [
							v["attributes"]["proposal"]["nsf_id"],
							keyExists("request.dollar", v["attributes"], null),
							keyExists("request.date", v["attributes"], null),
							v["attributes"]["pge"]["code"], 
							v["attributes"]["org"]["name"],
							v["attributes"]["topic"]["id"].join(", ").replace(', ,', ""), 
							//v["status"]["name"],
						]; 
					});

					var oTable = $('#declines_table', el).dataTable({
						//TableTools - copy, csv, print, pdf
						"bJQueryUI": true,
						"sPaginationType": "full_numbers",
						//"sDom": 'T<"clear">lfrtip',
						//"sDom": 'T<"clear"><"H"lfr>t<"F"ip>',
						"bDestroy": true,
						"bAutoWidth": false,
						"bProcessing": true,
						"iDisplayLength": 50,
						"aoColumnDefs": [
							{
								"sTitle": "Prop ID",
								"aTargets": [ 0 ]
							},
							{ 
								"fnRender": function ( oObj ) {
									return addCommas(oObj.aData[1]);
								},
								"bUseRendered": false,
								"sTitle": "Requested Amount",
								"aTargets": [ 1 ]
							},
							{ 
								"sTitle": "Request Date",
								"aTargets": [ 2 ] 
							}, 
							{ 
								"fnRender": function (oObj ) {
									return '<span id="pgecode_lookup_'+oObj.aData[3]+'">p'+oObj.aData[3]+'</span>';
								},
								"sTitle": "Prg. Elem. Code", 
								"aTargets": [ 3 ] 
							}, 
							{ "sTitle": "Division", "aTargets": [ 4 ] }, 
							{ 
								"fnRender": function ( oObj ) {
									var topics = oObj.aData[5].split(', ');
									var collated = _.map(topics, function(item) { if (legend_topics[item]) return 't'+item+':'+legend_topics[item]["label"]; else return 't'+item; });
									return collated.join(', ');
								},					
								"sTitle": "Topics", 
								"aTargets": [ 5 ] 
							}
						],
						"aaData": aaData,
						"aaSorting": [[2, 'desc'], [0, 'desc']],
						"oLanguage": {
							"sLengthMenu:": "Display _MENU_ records per page",
							"sSearch": "Keyword Filter:"
						}
					});
				} else if (this.tab == "awards") {
					var aaData = _.map(this.collection.models, function(v) { 
						return [
							v["attributes"]["proposal"]["nsf_id"],
							keyExists("awarded.dollar", v["attributes"], null),
							keyExists("awarded.date", v["attributes"], null),
							keyExists("request.date", v["attributes"], null),
							v["attributes"]["pge"]["code"], 
							v["attributes"]["org"]["name"],
							v["attributes"]["topic"]["id"].join(", ").replace(', ,', ""), 
							v["attributes"]["proposal"]["title"],
						]; 
					});
			//console.log(aaData);

					var oTable = $('#awards_table', el).dataTable({
						//TableTools - copy, csv, print, pdf
						"bJQueryUI": true,
						"sPaginationType": "full_numbers",
						//"sDom": 'T<"clear">lfrtip',
						//"sDom": 'T<"clear"><"H"lfr>t<"F"ip>',
						"bAutoWidth": false,
						"bDestroy": true,
						"bProcessing": true,
						"iDisplayLength": 50,
						"aoColumnDefs": [
							{
								"sTitle": "Prop ID",
								"aTargets": [ 0 ]
							},
							{ 
								"fnRender": function ( oObj ) {
									return addCommas(oObj.aData[1]);
								},
								"bUseRendered": false,
								"sTitle": "Awarded Amount",
								"aTargets": [ 1 ]
							},
							{ 
								"sTitle": "Award Date",
								"aTargets": [ 2 ] 
							}, 
							{ 
								"sTitle": "Request Date",
								"bVisible": false,
								"aTargets": [ 3 ] 
							}, 
							{ 
								"fnRender": function (oObj ) {
									return '<span id="pgecode_lookup_'+oObj.aData[4]+'">p'+oObj.aData[4]+'</span>';
								},
								"sTitle": "Prg. Elem. Code", 
								"aTargets": [ 4 ] 
							}, 
							{ "sTitle": "Division", "aTargets": [ 5 ] }, 
							{ 
								"fnRender": function ( oObj ) {
									var topics = oObj.aData[6].split(', ');
									var collated = _.map(topics, function(item) { if (legend_topics[item]) return 't'+item+':'+legend_topics[item]["label"]; else return 't'+item; });
									return collated.join(', ');
								},
								"sTitle": "Topics",
								"aTargets": [ 6 ]
							},
							{ 
								"fnRender": function ( oObj ) {
									return '<a class="award_details show-details" title="'+oObj.aData[7]+'">Show</a>';
								},
								"bSortable": false,						
								"sTitle": "Details",
								"aTargets": [ 7 ]
							}
						],
						"aaData": aaData,
						"aaSorting": [[1, 'desc']], //, [0, 'desc']
						"oLanguage": {
							"sLengthMenu:": "Display _MENU_ records per page",
							"sSearch": "Keyword Filter:"
						}
					});
				} else if (this.tab == "researchers") {			
					var aaData = _.map(this.collection.models, function(v) { 
						return [
							v["attributes"]["nsf_id"], 
							keyExists("name", v["attributes"], "Not Available"), 
							keyExists("inst.name", v["attributes"], "Not Available"),
							keyExists("inst.dept", v["attributes"], "Not Available"),
							v["attributes"]["count"],
							v["attributes"]["prop"].join(", "),
							'Show',
						]; 
					});

					var oTable = $('#researchers_table', el).dataTable({
						//TableTools - copy, csv, print, pdf
						"bJQueryUI": true,
						"sPaginationType": "full_numbers",					
						//"sDom": 'T<"clear">lfrtip',
						//"sDom": 'T<"clear"><"H"lfr>t<"F"ip>',
						"bDestroy": true,
						"bProcessing": true,
						"bAutoWidth": false,
						"iDisplayLength": 50,
						"aoColumnDefs": [
							{
								"sTitle": "PI ID",
								"aTargets": [ 0 ]
							},
							{ 
								"sTitle": "Name", 
								"aTargets": [ 1 ] 
							}, 
							{ "sTitle": "Institution", "aTargets": [ 2 ] }, 
							{ "sTitle": "Department", "aTargets": [ 3 ] },  
							{ 
								"sTitle": "Count*", 
								"aTargets": [ 4 ] 
							},  
							{ 
								"fnRender": function ( oObj ) {
									//wrap each prop id in a link
									var formatted = [];
									if (oObj.aData[5]) {
										var tmp = oObj.aData[5].split(', ');
										for (var i in tmp) {
											var link = 'http://www.nsf.gov/awardsearch/showAward.do?AwardNumber='+tmp[i];
											var title = 'Open in nsf.gov';
											if (proposalaccessallowed) {
												link = 'https://www.ejacket.nsf.gov/ej/showProposal.do?optimize=Y&ID='+tmp[i]+'&docid='+tmp[i];
												title = 'Open in e-Jacket';
											}
											formatted.push('<a href="'+link+'" title="'+title+'" target="_blank">'+tmp[i]+'</a>');
										}

									}
									return formatted.join(', ');
								},
								"bUseRendered": false,
								"sTitle": "IDs**", 
								"aTargets": [ 5 ] 
							},
							{ 
								"fnRender": function ( oObj ) {
									return '<a class="researcher_details show-details" title="'+oObj.aData[6]+'">Show</a>';
								},
								"bSearchable": false,
								"bSortable": false,						
								"sTitle": "Details",
								"aTargets": [ 6 ]
							}
						],
						"aaData": aaData,
						"aaSorting": [[4, 'desc']],
						"oLanguage": {
							"sLengthMenu:": "Display _MENU_ records per page",
							"sSearch": "Keyword Filter:"
						}
						//"sDom": 'T<"clear">lfrtip',
					});

					//hide pi id if public
					if (!proposalaccessallowed) {
						oTable.fnSetColumnVis( 0, false );
					}		
				}  else if (this.tab == "institutions") {	
//console.log(this.collection);							
					var aaData = _.map(this.collection.models, function(v) { 
						return [
							keyExists("nsf_id", v["attributes"], "Not Available"), 
							keyExists("name", v["attributes"], "Not Available"),
							v["attributes"]["count"],
							keyExists("pi", v["attributes"], []),
							v["attributes"]["prop"],
							'Show',
						]; 
					});
//console.log(aaData);

					var oTable = $('#institutions_table', el).dataTable({
						"bJQueryUI": true,
						"sPaginationType": "full_numbers",
						//"sDom": 'T<"clear">lfrtip',
						//"sDom": 'T<"clear"><"H"lfr>t<"F"ip>',
						"bDestroy": true,
						"bProcessing": true,
						"bAutoWidth": false,
						"iDisplayLength": 50,
						"aoColumnDefs": [
							{ 
								"sTitle": "Institution ID",
								"aTargets": [ 0 ]
							},
							{ 
								"sTitle": "Name", 
								"aTargets": [ 1 ] 
							}, 
							{ 
								"sTitle": "Number of Proposals", 
								"aTargets": [ 2 ] 
							}, 
							{ 
								"fnRender": function ( oObj ) {
									return oObj.aData[3].length;
								},
								"bVisible": false,
								"sTitle": "# of PIs", 
								"aTargets": [ 3 ]
							},
							{ 
								"fnRender": function ( oObj ) {
									//wrap each prop id in a link
									var formatted = [];
									if (oObj.aData[4]) {
										for (var i in oObj.aData[4]) {
											var link = 'http://www.nsf.gov/awardsearch/showAward.do?AwardNumber='+oObj.aData[4][i];
											var title = 'Open in nsf.gov';
											if (proposalaccessallowed) {
												link = 'https://www.ejacket.nsf.gov/ej/showProposal.do?optimize=Y&ID='+oObj.aData[4][i]+'&docid='+oObj.aData[4][i];
												title = 'Open in e-Jacket';
											}
											formatted.push('<a href="'+link+'" title="'+title+'" target="_blank">'+oObj.aData[4][i]+'</a>');
										}

									}
									return formatted.join(',');
								},
								"bUseRendered": false,
								"bVisible": false, 
								"sTitle": "Grant IDs", 
								"aTargets": [ 4 ] 
							},
							{ 
								"fnRender": function ( oObj ) {
									return '<a class="institution_details show-details" title="'+oObj.aData[5]+'">Show</a>';
								},
								"bSearchable": false,
								"bSortable": false,						
								"sTitle": "Details",
								"aTargets": [ 5 ]
							}					
						],
						"aaData": aaData,
						"aaSorting": [[2, 'desc']],
						"oLanguage": {
							"sLengthMenu:": "Display _MENU_ records per page",
							"sSearch": "Keyword Filter:"
						}
					});
		
					//hide inst id if public
					if (!proposalaccessallowed) {
						oTable.fnSetColumnVis( 0, false );
					}
				}

				//custom export button
				//export using the same query params as we used to load the table
				var exporturl = this.collection.url()+'&format=csv';
				$('<div class="export"><a href="'+exporturl+'">Export as CSV</a></div>').insertAfter('#'+this.tab+'_table_filter');
			
				$('#'+this.tab+'_loader').hide();

				//engage ui tabs for data tabs
				$('#data_tabs', el).tabs();
				//show appropriate tab
				//find the index
				var index = $('#data_tabs a[href="#'+'data_tabs_'+this.tab+'"]', el).parent().index();
		//console.log(index);	
				$('#data_tabs', el).tabs('select', index);				
				//set event traps
				$('#data_tabs', el).tabs({
					select: function(event, ui) {
						var url = $(ui.tab).attr('href');
			//console.log(url);			
				        if( url ) {
							var tab = url.split('_').pop();
							//redirect
							app_router.navigate("/explore/results/"+tab, true);
				        }
				        return true;
					}		
				});

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
	return new resultExploreView;
});