function aircraftsTabShow(){
    $("#graphContainer").hide();
    $("#stats_predic_Container").hide();
    $("#searchBox").hide();
    $("#planeList").show();
    $("#tilesContainer").hide();
    $("#mainContainer").show();
}

 function predictionTabShow(){
    showGraph('6');
    $("#graphContainer").show();
    $("#stats_predic_Container").show();
    $("#searchBox").show();
    $("#planeList").hide();
    $("#tilesContainer").hide();
 }

function graphTabShow() {
    $("#graphContainer").hide();
    $("#stats_predic_Container").hide();
    $("#searchBox").hide();
    $("#planeList").hide();
    $("#tilesContainer").show();
}