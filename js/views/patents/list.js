define([
	'jquery',
	'underscore',
	'backbone',
	//patents collection
	'collections/patents'
], function($, _,Backbone,patentsCollection,patentsListTemplate) {
	var patentListView = Backbone.View.extend({
		initialize: function() {
			this.el = '#patents_table';
			_.bindAll(this, 'render'); //you must do this to trap bound events
			this.collection = new patentsCollection;
			this.collection.bind("reset", this.render);
		},
		show: function() {
			//pass along the params
			this.collection.params = this.params;
			var self = this;
			require([
			  'order!js/libs/datatables/media/js/jquery.dataTables.min.js',
			  'order!js/libs/tabletools/media/js/TableTools.js',
			  'order!js/libs/tabletools/media/js/ZeroClipboard.js'
			], function(){	
				self.collection.fetch();
			});
		},
		render: function() {
			//console.log(this.el);				
			//console.log(this.collection.models);					
			//prepare for datatable data - conv to array
			var aaData = _.map(this.collection.models, function(v) { 
				return [
					v["attributes"]["title"],
					v["attributes"]["patent"],
					v["attributes"]["abstract"],
					v["attributes"]["grant_year"],
					v["attributes"]["assignee"],
					v["attributes"]["application_year"],
					v["attributes"]["classes"],
					v["attributes"]["inventors"],
					v["attributes"]["cited_by"]
				];
			});			

//console.log(aaData);
//console.log($('#divisions_table', el));
			var el = $(this.el);
			var oTable = el.dataTable({
				//TableTools - copy, csv, print, pdf
				"bJQueryUI": true,
				"sPaginationType": "full_numbers",
				//"sDom": 'T<"clear">lfrtip',
				//"sDom": 'T<"clear"><"H"lfr>t<"F"ip>',
				"sDom": '<"H"lTfr>t<"F"ip>',
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
				"bAutoWidth": false,
				"bProcessing": true,
				"iDisplayLength": 50,
				"aoColumnDefs": [
					{
						"sTitle": "Title",
						"aTargets": [ 0 ]
					},
					{
						"fnRender": function (oObj) {
							return "<a href='http://patft.uspto.gov/netacgi/nph-Parser?Sect1=PTO2&Sect2=HITOFF&p=1&u=%2Fnetahtml%2FPTO%2Fsearch-bool.html&r=1&f=G&l=50&co1=AND&d=PTXT&s1="+oObj.aData[1]+".PN.&OS=PN/"+oObj.aData[1]+"&RS=PN/"+oObj.aData[1]+"' target='_blank'>"+oObj.aData[1]+'</a>';
						},
						"bUseRendered": false,
						"sTitle": "Patent",
						"aTargets": [ 1 ]
					},
					{
						"sTitle": "Abstract",
						"bVisible": false,
						"aTargets": [ 2 ]
					},
					{
						"sTitle": "Grant Year",
						"aTargets": [ 3 ]
					},
					{
						"sTitle": "Assignee",
						"aTargets": [ 4 ]
					},
					{
						"sTitle": "Application Year",
						"aTargets": [ 5 ]
					},
					{
						"fnRender": function ( oObj ) {
							var collated = _.map(oObj.aData[6], function(item) { if (legend_classes[item]) return legend_classes[item]+' ('+item+')'; else return item; });
							return collated.join(', ');
						},
						"sTitle": "Classes",
						"aTargets": [ 6 ]
					},
					{
						"fnRender": function ( oObj ) {
							var collated = _.map(oObj.aData[7], function(row) { var tmp = row["name"]; if (row["nsf_id"]) tmp += ' (' + row["nsf_id"] + ')'; return tmp; });
							return collated.join(', ');
						},
						"sTitle": "Inventors",
						"aTargets": [ 7 ]
					},
					{
						"bVisible": false,
						"aTargets" : [8]
					},
					{
						"fnRender": function ( oObj ) {
							return '<a id="patent_details_'+oObj.aData[1]+'" class="patent_details show-details">Show</a>';
						},
						"bSearchable": false,
						"bSortable": false,
						"aTargets": [ 9 ]
					}
				],
				"aaData": aaData,
				"aaSorting": [[0, 'desc']],
				"oLanguage": {
					"sLengthMenu:": "Display _MENU_ records per page",
					"sSearch": "Keyword Filter:"
				}
			});
//console.log(el.html());				

			//add a form element to the table header
			$('<div id="data_filter_application_year_container">By Application Year: <select name="data_filter_application_year"><option value="">Select One</option></select></div>').insertAfter('#patents_table_length');
		
			//group by application year
			var grouped = _.groupBy(this.collection.models,function(model) {
				return model["attributes"]['application_year'];
			});
	//console.log(grouped);
			//compute totals
			var collated = [];
			for (var key in grouped) {
				collated.push(_.reduce(grouped[key], function(memo, row) {
					return {"year":key,"count":memo["count"]+1};
				},{"year":key,"count":0}));
			}
			//sort by year
			_.sortBy(collated,function(row) { return row["year"];});
		
			//populate the select drop down
			_.each(collated, function(item) {
				$("select[name=data_filter_application_year]").append('<option value='+item.year+'>'+item.year+ ' ('+item.count+')</option>');
			});
		}
	});
	// Returning instantiated views can be quite useful for having "state"
	return new patentListView;
});