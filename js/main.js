// Require.js allows us to configure shortcut alias
// They will be used later
require.config({
  paths: {
    jquery: 'libs/jquery/jquery',
    underscore: 'libs/underscore/underscore',
    backbone: 'libs/backbone/backbone',
  }
});

require([
  // Load our app module and pass it to our definition function
  'app',

  // Some plugins have to be loaded in order due to there non AMD compliance
  // Because these scripts are not "modules" they do not pass any values to the definition function below
  //'order!libs/tmpload/tmpload'
  //'order!js/libs/jquery/jquery-min.js',
  //'order!js/libs/datatables/media/js/jquery.dataTables.min.js',
  //'order!js/libs/jquery-ui/jquery-ui-1.8.14.custom.min.js',
  //'order!js/libs/tabletools/media/js/TableTools.js',
  //'order!js/libs/tabletools/media/js/ZeroClipboard.js'
], function(App){	
  // The "app" dependency is passed in as "App"
  // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
  App.initialize();
});