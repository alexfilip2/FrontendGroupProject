//Performs cache clearing methods to cause the data for the graphs to be read from the server
var cache = {};
clearCache();
function clearCache() {
    cache = {};
    var timeoutPeriodInMins = 10;
    setTimeout(clearCache, 1000 * 60 * timeoutPeriodInMins);
}

function getJSONFromBackend(path, functions, argument, cachetype) {
    url = BASE_URL + path;
    xhr = new XMLHttpRequest();
    xhr.open("GET", url + argument, true);

    xhr.onreadystatechange = function () {
        if (xhr.status == 200) {
            if (!xhr.response) return;
            cache[cachetype] = JSON.parse(xhr.response);
            functions(cache[cachetype]);
        }
    };
    xhr.send(null);
}

function showGraph(idGraph) {
     /*hide the right elements and show the graphContainer so the graph will appear on the page*/
    $("#tilesContainer").hide();

    if (idGraph == 1) {
        if (cache['data_dust'] == undefined)
            getJSONFromBackend('/dustExposureGraph', plotDustVariationGraph, "", 'data_dust');
        else
            plotDustVariationGraph(cache['data_dust']);
    }
     if (idGraph == 2) {
        if (cache['data_dust_variation'] == undefined)
            getJSONFromBackend('/dustVariation', dustGraph, "", 'data_dust_variation');
        else
            dustGraph(cache['data_dust_variation']);
    }
    if (idGraph == 3) {
        if (cache['data_histogram'] == undefined)
            getJSONFromBackend('/histogram', plotDistributionOfCyclesGraph, "", 'data_histogram');
        else
            plotDistributionOfCyclesGraph(cache['data_histogram']);
    }
    if (idGraph == 4) {
        if (cache['fail_percent_chance'] == undefined)
            getJSONFromBackend('/failchance', failureChance, "", 'fail_percent_chance');
        else
            failureChance(cache['fail_percent_chance']);
    }
    if (idGraph == 5) {
        if (cache['remaining_cycles'] == undefined)
            getJSONFromBackend('/remainingCycles', remainingCyclesNow, "", 'remaining_cycles');
        else
            remainingCyclesNow(cache['remaining_cycles']);
    }
    $("#graphContainer").show();
}

/* show back to the menu of the mainContainer by hidding the current displayed graph
 * which is in graphContainer
 */

function showRiskGraph() {
    if (cache['data_risk_graph'] == undefined) {
        getJSONFromBackend('/riskGraph', plotRiskGraph, "", 'data_risk_graph');
           }

    else
        plotRiskGraph(cache['data_risk_graph']);
}

//PLOTS THE RISK GRAPH THAT SHOWS FOR A PARTICULAR ENGINE GIVEN AS INPUT BY THE USER
function riskForOnePlaneGraph() {
    var text = "?engine=" + document.getElementById("searchAircraft").value;
    getJSONFromBackend('/specificRiskData', plotRiskGraph, text);
}



