define([
	'jquery',
	'underscore',
	'backbone',
	//topics collection
	'collections/topics'
], function($, _, Backbone, topicsCollection) {
		var topicsListView = Backbone.View.extend({
			initialize: function() {
				_.bindAll(this, 'render'); //you must do this to trap bound events
				this.el = '#topics_table';
				this.collection = new topicsCollection;
				//bind
				this.collection.bind("reset", this.render);
			},
			show: function() {
				//pass along the params
				this.collection.params = this.params;
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
				//prepare for datatable data - conv to array
				var aaData = _.map(this.collection.models, function(row) {
					return [row['attributes']["t1"], row['attributes']["label"], row['attributes']["words"], row['attributes']["count_awarded"],row['attributes']["funding_awarded"],row['attributes']["count_declined"],row['attributes']["count_other"],row['attributes']["funding_requested"],row['attributes']["suppress"]];
				});
//console.log(aaData);		

				//rearrange datatable header depending on whether we're going to show filter element or not
				var sDom = '<"H"Tflr>t<"F"ip>';
				if (this.includefilter) sDom = '<"H"Tflr>t<"F"ip>';

				var oTable = $(this.el).dataTable({
					//TableTools - copy, csv, print, pdf
					"bJQueryUI": true,
					"sPaginationType": "full_numbers",
					//"sDom": 'T<"clear">lfrtip',
					//"sDom": 'T<"clear"><"H"lfr>t<"F"ip>',
					"sDom": sDom,
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
								return '<input type="checkbox" name="topic[]" value="'+oObj.aData[0]+'">';
							},
							"sClass": "center",
							"bUseRendered": false,
							"bSearchable": false,
							"bSortable": false,
							"sTitle": "Select",
							"aTargets": [ 0 ]
						},
						{
							"fnRender": function ( oObj ) {
								var html = '<strong>t'+oObj.aData[0]+': '+oObj.aData[1]+'</strong>';
								if (oObj.aData[2]) html += ' - '+oObj.aData[2];
								return html;
							},
							"sTitle": "Topic",
							"aTargets": [ 1 ]
						},
						{
							"bVisible": false,
							"aTargets": [2]
						},
						{
							"sTitle": "Awarded",
							"bVisible": false,
							"aTargets": [ 3 ]
						},
						{
							"fnRender": function ( oObj ) {
								return formatFunding(oObj.aData[4]);
							},
							"bUseRendered": false,
							"bVisible": false,
							"sTitle": "Awarded Amt.",
							"aTargets": [ 4 ]
						},
						{
							"bVisible": false,
							"sTitle": "Declined",
							"aTargets": [ 5 ]
						},
						{
							"bVisible": false,
							"sTitle": "Other",
							"aTargets": [ 6 ]
						},
						{
							"fnRender": function ( oObj ) {
								return formatFunding(oObj.aData[7]);
							},
							"bUseRendered": false,
							"bVisible": false,
							"sTitle": "Requested Amt.",
							"aTargets": [ 7 ]
						},
						{
							"bVisible": false,
							"aTargets": [ 8 ]
						},
						{
							"fnRender": function ( oObj ) {
								if (oObj.aData[0]=='0') return '';
								else return '<a id="topic_details_'+oObj.aData[0]+'" class="show-details">Show</a>';
							},
							"bSearchable": false,
							"bSortable": false,
							"aTargets": [ 9 ]
						}
					],
					"aaSorting": [[8, 'asc'],[3, 'desc']],
					"oLanguage": {
						"sLengthMenu:": "Display _MENU_ records per page",
						"sSearch": "Keyword Filter:"
					}
				});

				//conditional columns as necessary
				//what are the currently selected filter statuses
				var filter_status = $('input[name=filter_status]:checked').val();

				//prepare columns
				//conditional columns
				//if showing completed actions
			//console.log(filter_status);	
				/*if (filter_status=='completed') {
					oTable.fnSetColumnVis( 3, true );
					oTable.fnSetColumnVis( 4, true );
					if (proposalaccessallowed) {
						oTable.fnSetColumnVis( 5, true );
						oTable.fnSetColumnVis( 7, true );			
					}
				} else if (proposalaccessallowed) {
					oTable.fnSetColumnVis( 6, true );
					oTable.fnSetColumnVis( 7, true );		
				}*/

				//add a form element to the table header
				if (this.includefilter) $('<div id="topic_operator_container">Inclusion*: <select name="filter_topic_operator"><option value="," selected>Awards matching ANY selected Topic</option><option value="+">Awards matching ALL selected Topics</option></select></div>').insertAfter('#topics_table_length');
//console.log($(this.el).html());
			}
		});
		return new topicsListView;
});