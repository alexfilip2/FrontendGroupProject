function insightsTabShow() {
    //Reset the selected graph to display the tilecontainers
    SELECTEDGRAPH = 0;

    /*hide all the HTML elements of the "Comparisons" panel*/
    $("#comparisonsPanel").hide();
    $("#aircraftPanel").hide();
    $("#graphContainer").hide();
    $("#insightsPanel").show();
    $("#tilesContainer").show();
    $("#includeTextInsightDescription").hide();
    $('#containerDropDown').show();
}

function comparisonsTabShow() {

    $("#insightsPanel").hide();
    $("#aircraftPanel").hide();
    $("#graphContainer").hide();
    $("#containerMultiInput").hide();
    $("#comparisonInsideTileContainer").hide();
    $("#comparisonsPanel").show();
    $("#tilesContainerComparisons").show();
}

function aircraftsTabShow() {
    $("#insightsPanel").hide();
    $("#comparisonsPanel").hide();
    $("#aircraftPanel").show();
}

function displayComparisonTileContent() {
    $("#tilesContainerComparisons").hide();
    $("#comparisonInsideTileContainer").show();
    $("#containerMultiInput").show();
}