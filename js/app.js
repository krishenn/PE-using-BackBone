var proposalaccessallowed = false;
var apiurl = 'http://readidata.nitrd.gov/star/py/api.py/'; //_beta

var app_router;

var divisions = {
"OCI":"Office of Cyberinfrastructure",
"OGC":"Office of the General Counsel",
"OIA":"Office of Integrative Activities",
"OISE":"Office of International Science and Engineering",
"ODI":"Office of Diversity and Inclusion (ODI)",
"OLPA":"Office of Legislative & Public Affairs",
"OPP":"Office of Polar Programs",
"NSB":"Office of the Assistant Director",
"OIG":"Office of the Assistant Director",
"MCB":"Division of Molecular & Cellular Biosciences",
"DBI":"Division of Biological Infrastructure",
"IOS":"Division of Integrative Organismal Systems",
"DEB":"Division of Environmental Biology",
"EF":"Emerging Frontiers Office",
"CCF":"Division of Computing and Communication Foundations",
"CNS":"Division of Computer and Network Systems",
"IIS":"Division of Information and Intelligent Systems",
"DRL":"Division of Research on Learning in Formal and Informal Settings",
"DGE":"Division of Graduate Education",
"HRD":"Division of Human Resource Development",
"DUE":"Division of Undergraduate Education",
"CBET":"Division of Chemical, Bioengineering, Environmental, and Transport Systems",
"CMMI":"Division of Civil, Mechanical & Manufacturing Innovation",
"ECCS":"Division of Electrical, Communications & Cyber Systems",
"EEC":"Division of Engineering Education & Centers",
"EFRI":"Office of Emerging Frontiers in Research & Innovation",
"IIP":"Division of Industrial Innovation & Partnerships",
"ENG":"Office of the Assistant Director",
"AGS":"Division of Atmospheric and Geospace Sciences",
"EAR":"Division of Earth Sciences",
"OCE":"Division of Ocean Sciences",
"GEO":"Office of the Assistant Director",
"AST":"Division of Astronomical Sciences",
"CHE":"Division of Chemistry",
"DMR":"Division of Materials Research",
"DMS":"Division of Mathematical Sciences",
"PHY":"Division of Physics",
"MPS":"Office of the Assistant Director",
"SES":"Division of Social and Economic Sciences",
"BCS":"Division of Behavioral and Cognitive Sciences",
"NCSE":"National Center for Science and Engineering Statistics",
"SMA":"SBE Office of Multidisciplinary Activities",
"SBE":"Office of the Assistant Director",
"BD":"Budget Division",
"DACS":"Division of Acquisition and Cooperative Support",
"DFM":"Division of Financial Management",
"DGA":"Division of Grants & Agreements",
"DIAS":"Division of Institution and Award Support",
"HRM":"Division of Human Resource Management",
"DIS":"Division of Information Systems",
"DAS":"Division of Administrative Services",
"EPSCoR":"Office of Experimental Program To Stimulate Competitive Research",
"EPS":"Office of Experimental Program to Stimulate Competitive Research"
};

var directorates = {
"OCI":"Office of the Director",
"OGC":"Office of the Director",
"EPSCoR":"Office of Information & Resource Management",
"OISE":"Office of the Director",
"ODI":"Office of the Director",
"OLPA":"Office of the Director",
"OPP":"Office of the Director",
"NSB":"National Science Board",
"OIG":"Office of the Inspector General",
"MCB":"Directorate for Biological Sciences",
"DBI":"Directorate for Biological Sciences",
"IOS":"Directorate for Biological Sciences",
"DEB":"Directorate for Biological Sciences",
"EF":"Directorate for Biological Sciences",
"CCF":"Directorate for Computer & Information Science & Engineering",
"CNS":"Directorate for Computer & Information Science & Engineering",
"IIS":"Directorate for Computer & Information Science & Engineering",
"DRL":"Directorate for Education & Human Resources",
"DGE":"Directorate for Education & Human Resources",
"HRD":"Directorate for Education & Human Resources",
"DUE":"Directorate for Education & Human Resources",
"CBET":"Directorate for Engineering",
"CMMI":"Directorate for Engineering",
"ECCS":"Directorate for Engineering",
"EEC":"Directorate for Engineering",
"EFRI":"Directorate for Engineering",
"IIP":"Directorate for Engineering",
"AGS":"Directorate for Geosciences",
"EAR":"Directorate for Geosciences",
"OCE":"Directorate for Geosciences",
"AST":"Directorate for Mathematical & Physical Sciences",
"CHE":"Directorate for Mathematical & Physical Sciences",
"DMR":"Directorate for Mathematical & Physical Sciences",
"DMS":"Directorate for Mathematical & Physical Sciences",
"PHY":"Directorate for Mathematical & Physical Sciences",
"SES":"Directorate for Social, Behavioral & Economic Sciences",
"BCS":"Directorate for Social, Behavioral & Economic Sciences",
"NCSE":"Directorate for Social, Behavioral & Economic Sciences",
"SMA":"Directorate for Social, Behavioral & Economic Sciences",
"BD":"Office of Budget, Finance, and Award Management",
"DACS":"Office of Budget, Finance, and Award Management",
"DFM":"Office of Budget, Finance, and Award Management",
"DGA":"Office of Budget, Finance, and Award Management",
"DIAS":"Office of Budget, Finance, and Award Management",
"HRM":"Office of Information & Resource Management",
"DIS":"Office of Information & Resource Management",
"DAS":"Office of Information & Resource Management",
"ANT":"Directorate for Polar Research",
"ARC":"Directorate for Polar Research",
"PEHS":"Directorate for Polar Research",
"AIL":"Directorate for Polar Research",
"EPS":"Office of Information & Resource Management",
"OIA":"Office of the Director",
"ENG":"Directorate for Engineering",
"GEO":"Directorate for Geosciences",
"MPS":"Directorate for Mathematical & Physical Sciences",
"SBE":"Directorate for Social, Behavioral & Economic Sciences"
};

var legend_topics = {};
var legend_classes = {};

define([
  'jquery',
  'underscore',
  'backbone',
  'router' // Request router.js
], function($, _, Backbone, Router){
	var initialize = function(){
console.log('initializing app');

	// Check to see if we have access to nsfstarmetrics server 
	$.ajax({
		url: "http://128.150.10.70/py/api.py/access",
		dataType: 'JSONP',
		timeout: 2000,
		success: function(data) {
	//console.log(data);
			proposalaccessallowed = true;
			apiurl = "http://128.150.10.70/py/api.py/";
//alert('success');
			//start
			start();
		},
		error: function(x,t,m) {
//alert('error');
//alert(t);
	//		console.log(data);
			start();
		}
	});	
  }

  function start() {
		//load topic legend
		$.getJSON(apiurl+'topic?legend=topic'+'&jsoncallback=?', function(data) {
			_.each(data, function(item) {
				legend_topics[item["topic"]] = {"words":item["words"],"label":item["label"]};
			});
			// Pass in our Router module and call it's initialize function
		    Router.initialize();
		});					
//alert(proposalaccessallowed);
//alert(apiurl);			
//console.log(apiurl);	
  }

  return {
    initialize: initialize
  };
});

function formatFunding(funding) {
//console.log(funding);
	if (funding && parseInt(funding)>0) return '$'+(funding/1000000).toFixed(2)+'M';
	else return '';
}

//adding commas to a number to format it
function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

//convert a formatted number string back to a pure number
function removeNumberFormatting(rawstring) {
	return rawstring.replace(/[^\d\.\-\ ]/g, '');	
}

// left padding s with c to a total of n chars
function padding_left(s, c, n) {
    if (! s || ! c || s.length >= n) {
        return s;
    }

    var max = (n - s.length)/c.length;
    for (var i = 0; i < max; i++) {
        s = c + s;
    }

    return s;
}

//Check to see if the data exists or is null 
function keyExists(key, object, value) {
	if (value == null)
		value = "";
	$(key.split(".")).each(function(i, v) {
		if (v in object) 
			object = object[v];
		else {
			object = value;
			return false;
		}
	});
	return object;
}

function fnGetSelected( oTableLocal )
{
    var aReturn = new Array();
    var aTrs = oTableLocal.fnGetNodes();
     
    for ( var i=0 ; i<aTrs.length ; i++ )
    {
        if ( $(aTrs[i]).hasClass('row_selected') )
        {
            aReturn.push( oTableLocal.fnGetData(aTrs[i]) ); //return data, not node
        }
    }
    return aReturn;
}

function fnGetSelectedRows( oTableLocal )
{
    var aReturn = new Array();
    var aTrs = oTableLocal.fnGetNodes();
     
    for ( var i=0 ; i<aTrs.length ; i++ )
    {
        if ( $(aTrs[i]).hasClass('row_selected') )
        {
            aReturn.push( aTrs[i] ); //return node
        }
    }
    return aReturn;
}

function fnGetNotSelectedRows( oTableLocal )
{
    var aReturn = new Array();
    var aTrs = oTableLocal.fnGetNodes();
     
    for ( var i=0 ; i<aTrs.length ; i++ )
    {
        if ( !$(aTrs[i]).hasClass('row_selected') )
        {
            aReturn.push( aTrs[i] ); //return node
        }
    }
    return aReturn;
}
