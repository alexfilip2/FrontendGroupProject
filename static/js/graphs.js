function showGraph(idGraph) {
      var text = "?engine=" + document.getElementById("searchAircraft").value;

      /*hide the right elements and show the graphContainer so the graph will appear on the page*/
    $("#tilesContainer").hide();

    if (idGraph == 1) {
        if (cache['data_dust'] == undefined)
            getJSONFromBackend('/dustExposureGraph', plotDustVariationGraph, "", 'data_dust');
        else
            dust_per_cycle_Graph(cache['data_dust']);
    }
    if (idGraph == 3) {
        if (cache['data_histogram'] == undefined)
            getJSONFromBackend('/histogram', plotDistributionOfCyclesGraph, "", 'data_histogram');
        else
            remainingCyclesNow(cache['data_histogram']);
    }
    if (idGraph == 2) {
        if (cache['data_dust_variation'] == undefined)
            getJSONFromBackend('/dustVariation', dustGraph, "", 'data_dust_variation');
        else
            dustVariation(cache['data_dust_variation']);
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
    if (cache['data_risk_graph'] == undefined)
        getJSONFromBackend('/riskGraph', riskPlot, "", 'data_risk_graph');
    else
        riskPlot(cache['data_risk_graph']);
}

//PLOTS THE RISK GRAPH THAT SHOWS FOR A PARTICULAR ENGINE GIVEN AS INPUT BY THE USER
function riskForOnePlaneGraph() {
    var text = "?engine=" + document.getElementById("searchAircraft").value;
    getJSONFromBackend('/specificRiskData', riskPlot, text);
}

//PLOTS THE RISK GRAPH THAT SHOWS FOR EACH ENGINE THE FAILURE DATE IN A VISUAL WAY
function riskPlot(data) {
    var chart = AmCharts.makeChart("riskGraphContainer", {
    })
}

