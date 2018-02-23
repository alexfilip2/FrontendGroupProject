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
    $('#containerDropDown').hide();

    if (idGraph == 1) {
        if (cache['data_dust'] == undefined)
            getJSONFromBackend('/dustExposureGraph', dustExposureGraph, "", 'data_dust');
        else
            dustExposureGraph(cache['data_dust']);
    }
    if (idGraph == 2) {
        if (cache['RULVariation'] == undefined)
            getJSONFromBackend('/RULVariation', plotRULVariationGraph, "", 'RULVariation');
        else
            plotRULVariationGraph(cache['RULVariation']);
    }
    if (idGraph == 3) {
        if (cache['dust_acc'] == undefined)
            getJSONFromBackend('/dustAccumulationGraph', dustAccumulationGraph, "", 'dust_acc');
        else
            dustAccumulationGraph(cache['dust_acc']);
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

function showRiskAndHisto() {

    if (cache['data_risk_graph'] == undefined)
        getJSONFromBackend('/riskGraph', plotRiskGraph, "", 'data_risk_graph');
    else
        plotRiskGraph(cache['data_risk_graph']);
    window.setTimeout(function () {
         if (cache['histo_data'] == undefined)
        getJSONFromBackend('/histogram', plotDistributionOfCyclesGraph, "", 'histo_data');
    else
        plotDistributionOfCyclesGraph(cache['histo_data']);
    },800);

}

function multiChoice() {
    var multi_list = [];

    $('ul.multi_input_list li.multi_input_tagElem').each(function (elem) {

        var content = jQuery(this).find("span")[1].innerHTML;
        multi_list.push(content)
    });
    asyncPOSTRequest(multi_list, '/multiChoice?type=histo', plotDistributionOfCyclesGraph, 'choices');
    asyncPOSTRequest(multi_list, '/multiChoice?type=risk', plotRiskGraph, 'choices');

}
