var BASE_URL = 'http://127.0.0.1:5000'
var AIRCRAFTLIST;
var SELECTEDAIRCRAFTS = [];
var SELECTEDGRAPH = 0;
var SELECTEDCOMPARISONGRAPH =0;
//Performs cache clearing methods to cause the data for the graphs to be read from the server
var cache = {};
clearCache();

function clearCache() {
    cache = {};
    var timeoutPeriodInMins = 10;
    setTimeout(clearCache, 1000 * 60 * timeoutPeriodInMins);
}