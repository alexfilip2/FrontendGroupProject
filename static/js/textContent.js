function addTextToComparisonPanel(type) {
    $(document).ready(function (e) {
        switch (type) {
            case 'risk':
                $("#includeTextDescription").load("description.html #descriptionRiskPlot");
                break;
            case 'histo' :
                $("#includeTextDescription").load("description.html #descriptionHistogramPlot");
                break;

        }


        listair = [{'ID': 6, 'predicted': 25, 'working': 30}, {'ID': 20, 'predicted': 8, 'working': 66},
            {'ID': 7, 'predicted': 25, 'working': 30}, {'ID': 32, 'predicted': 88, 'working': 30}];
        addFailureTimeText(listair);

    });
}

function addDescriptionToInsight(type) {
    $(document).ready(function (e) {
        switch (type) {

            case 'dustExposureGraph':
                $("#includeTextInsightDescription").load("description.html #descriptionDustExposureGraph");
                break;
            case 'RULVariation':
                $("#includeTextInsightDescription").load("description.html #descriptionRULVariation");
                break;
            case 'dustAccumulationGraph':
                $("#includeTextInsightDescription").load("description.html #descriptionDustAccumulationGraph");
                break;
            case 'failchance':
                $("#includeTextInsightDescription").load("description.html #descriptionFailChance");
                break;
            case 'rulWithDust':
                $("#includeTextInsightDescription").load("description.html #descriptionRULWithDust");
                break;
        }

    });
}


function addFailureTimeText(list) {

    document.getElementById("includeTextPrediction").innerHTML = "<div id=\"predictions\" class=\"textPanel\">\n" +
        "    <h1 class=\"failureLable\">Failure time prediction</h1>\n" +
        "    <div class=\"container bootstrap snippet\">\n" +
        "        <div class=\"panel-body inf-content\" >\n" +
        "            <div class=\"row\"  style=\"width: 80%\">\n" +
        "                <div class=\"col-md-6\" style=\"width: 100%\"> \n" +
        "                    <table class=\"table table-condensed table-responsive table-user-information\">\n" +
        "                        <tbody id=\"aircraftsText\">\n" +
        "                        </tbody>\n" +
        "                    </table>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "</div>"

    addIndividualAircraftPrediction(list);

}

function addIndividualAircraftPrediction(list) {

    for (i = 0; i < list.length; i++) {
        document.getElementById("aircraftsText").innerHTML += "<h3 class='fordescription' id=\"aircraftName\" style='padding-top: 10px'>Aircraft ID: " + list[i]['ID'] +
            "</h3>\n" +
            "                        <tr style=\"width: 100%\">\n" +
            "                            <td  >\n" +
            "                                <p>\n" +
            "                                    <span class=\"glyphicon glyphicon-hourglass\"></span>\n" +
            "                                    Predicted number of cycles until failure from now on:\n" +
            "                                </p>\n" +
            "                            </td>\n" +
            "                            <td id=\"predictedCyclesIndivAircraft\" class=\"text-primary\">\n"
            + list[i]['predicted'] + " </td>\n" +
            "                            <td  >\n" +
            "                                <p>\n" +
            "                                    <span class=\"glyphicon glyphicon-hourglass\"></span>\n" +
            "                                  Number of already worked cycles by the engine:\n" +
            "                                </p>\n" +
            "                            </td>\n" +
            "                            <td id=\"workedCyclesIndivAircraft\" class=\"text-primary\">\n" +
            +list[i]['working'] +
            "                            </td>\n" +
            "                        </tr>";
    }

}
