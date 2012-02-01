define([
	'jquery',
	'underscore',
	'backbone',
	//divisions collection
	'collections/divisions'
], function($, _, Backbone, divisionsCollection) {
		var divisionsListView = Backbone.View.extend({
			initialize: function() {
				this.el = '#divisions_table';
				_.bindAll(this, 'render'); //you must do this to trap bound events
				this.collection = new divisionsCollection;
				//bind
				this.collection.bind("reset", this.render);
			},
			show: function() {
//console.log(this.el);				
//console.log(this.params);						
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
				var aaData = _.map(this.collection.models, function(row) {
					return [row['attributes']["org"], row['attributes']["title"], row['attributes']["directorate"], row['attributes']["count_awarded"],row['attributes']["funding_awarded"],row['attributes']["count_declined"],row['attributes']["count_other"],row['attributes']["funding_requested"]];
				});
//console.log(aaData);
//console.log($('#divisions_table', el));
				var el = $(this.el);
				var oTable = el.dataTable({
					//TableTools - copy, csv, print, pdf
					"bJQueryUI": true,
					"sPaginationType": "full_numbers",
					"bDestroy": true,
					"bProcessing": true,
					"bAutoWidth": false,
					"iDisplayLength": 50,
					"aaData": aaData,
					"fnDrawCallback": function ( oSettings ) {
						if ( oSettings.aiDisplay.length == 0 )
						{
							return;
						}			
						var nTrs = $('tbody tr', el);
						var iColspan = nTrs[0].getElementsByTagName('td').length;
						var sLastGroup = "";
						for ( var i=0 ; i<nTrs.length ; i++ )
						{
							var iDisplayIndex = oSettings._iDisplayStart + i;
							var sGroup = oSettings.aoData[ oSettings.aiDisplay[iDisplayIndex] ]._aData[2];
							if ( sGroup != sLastGroup )
							{
								var nGroup = document.createElement( 'tr' );
								var nCell = document.createElement( 'td' );
								nCell.colSpan = iColspan;
								nCell.className = "group";
								nCell.innerHTML = sGroup;
								nGroup.appendChild( nCell );
								nTrs[i].parentNode.insertBefore( nGroup, nTrs[i] );
								sLastGroup = sGroup;
							}
						}
					},
					"aoColumnDefs": [
						{
							"fnRender": function ( oObj ) {
								return '<input type="checkbox" name="division[]" value="'+oObj.aData[0]+'">';
							},
							"sClass": "center",
							"bSearchable": false,
							"bSortable": false,
							"bUseRendered": false,
							"sTitle": "Select",
							"aTargets": [ 0 ]
						},
						{
							"fnRender": function ( oObj ) {
								return oObj.aData[1]+' ('+oObj.aData[0]+')';
							},
							"sTitle": "Divisions",
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
							"sTitle": "Declined",
							"bVisible": false,
							"aTargets": [ 5 ]
						},
						{
							"sTitle": "Other",
							"bVisible": false,
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
							"fnRender": function ( oObj ) {
								return '<a id="division_details_'+oObj.aData[0]+'" class="show-details">Show</a>';
							},
							"bSearchable": false,
							"bSortable": false,
							"aTargets": [ 8 ]
						}
					],
					//"aaSortingFixed": [[ 2, 'asc' ]]
					//"aaSorting": [[ 1, 'asc' ]]
					"bSort": false,
					"oLanguage": {
						"sLengthMenu:": "Display _MENU_ records per page",
						"sSearch": "Keyword Filter:"
					}
				});
//console.log(el.html());				

				//conditional columns as necessary
				//what are the currently selected filter statuses
/*				var filter_status = $('input[name=filter_status]:checked', el).val();

				//prepare columns
				//conditional columns
				//if showing completed actions
			//console.log(filter_status);	
				if (filter_status=='completed') {
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
			}
		});
		return new divisionsListView;
});