function graphTabShow() {
    /*hide all the HTML elements of the "Predictions" panel*/
    $("#predictionsPanel").hide();
    $("#aircraftPanel").hide();
    $("#graphContainer").hide();

    $("#graphsPanel").show();
    $("#tilesContainer").show();
}

function predictionTabShow() {
    showRiskGraph();
    $("#graphsPanel").hide();
    $("#aircraftPanel").hide();
    $("#graphContainer").hide();
    $("#predictionsPanel").show();
}

function aircraftsTabShow() {
    $("#graphsPanel").hide();
    $("#predictionsPanel").hide();
    $("#aircraftPanel").show();
}
