function showGraph() {
    $("#tilesContainer").hide();
    $("#graphContainer").show();

    switch (SELECTEDCOMPARISONGRAPH ) {
        case 0:
            $("#tilesContainer").show();
            $("#graphContainer").hide();
            break;
        case 1:
            if (cache['data_dust'] == undefined) getJSONFromBackend('/dustExposureGraph', dustExposureGraph, "", 'data_dust');
            else dustExposureGraph(cache['data_dust']);
            addDescriptionToInsight('dustExposureGraph');
            break;
        case 2:
            if (cache['RULVariation'] == undefined) getJSONFromBackend('/RULVariation', plotRULVariationGraph, "", 'RULVariation');
            else plotRULVariationGraph(cache['RULVariation']);
            addDescriptionToInsight('RULVariation');
            break;
        case 3:
            if (cache['dust_acc'] == undefined) getJSONFromBackend('/dustAccumulationGraph', dustAccumulationGraph, "", 'dust_acc');
            else dustAccumulationGraph(cache['dust_acc']);
            addDescriptionToInsight('dustAccumulationGraph');
            break;
        case 4:
            if (cache['fail_percent_chance'] == undefined) getJSONFromBackend('/failchance', failureChance, "", 'fail_percent_chance');
            else failureChance(cache['fail_percent_chance']);
            addDescriptionToInsight('failchance');
            break;
        case 5:
            if (cache['RUL_with_dust'] == undefined) getJSONFromBackend('/rulWithDust', RULwithDust, "", 'RUL_with_dust');
            else RULwithDust(cache['RUL_with_dust']);
            addDescriptionToInsight('rulWithDust');
            break;
    }
    if(  $("#graphContainer").is(":visible"))  $("#includeTextInsightDescription").show();
}

function showRiskGraph() {
    SELECTEDCOMPARISONGRAPH = 6;
    if (cache['data_risk_graph'] == undefined)
        getJSONFromBackend('/riskGraph', plotRiskGraph, "", 'data_risk_graph');
    else
        plotRiskGraph(cache['data_risk_graph']);

    addTextToComparisonPanel('risk');
    displayComparisonTileContent();
}

function showHistogramGraph() {
    SELECTEDCOMPARISONGRAPH = 7;
    if (cache['histo_data'] == undefined)
        getJSONFromBackend('/histogram', plotDistributionOfCyclesGraph, "", 'histo_data');
    else
        plotDistributionOfCyclesGraph(cache['histo_data']);

    addTextToComparisonPanel('histo');
    displayComparisonTileContent();
}

function showMultiChoice() {
    var multi_list = [];
    $('ul.multi_input_list li.multi_input_tagElem').each(function (elem) {
        var content = jQuery(this).find("span")[1].innerHTML;
        multi_list.push(content)
    });
    if (multi_list.length > 0) {
        switch (SELECTEDCOMPARISONGRAPH) {
            case 6:
                asyncPOSTRequest(multi_list, '/multiChoice?type=risk', plotRiskGraph, 'choices');
                break;
            case 7:
                asyncPOSTRequest(multi_list, '/multiChoice?type=histo', plotDistributionOfCyclesGraph, 'choices');
                break;
        }
    }
}