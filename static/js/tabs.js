function graphTabShow() {
    /*hide all the HTML elements of the "Predictions" panel*/
    $("#predictionsPanel").hide();
    $("#aircraftPanel").hide();
    $("#graphContainer").hide();
    $("#containerMultiInput").hide();

    $("#graphsPanel").show();
    $("#tilesContainer").show();
    $('#containerDropDown').show();
}

function predictionTabShow() {
    showRiskAndHisto();
    $('#containerMultiInput').show();
    $("#graphsPanel").hide();
    $("#aircraftPanel").hide();
    $("#graphContainer").hide();
    $("#predictionsPanel").show();
}

function aircraftsTabShow() {
    $("#containerMultiInput").hide();
    $("#graphsPanel").hide();
    $("#predictionsPanel").hide();
    $("#aircraftPanel").show();
}
