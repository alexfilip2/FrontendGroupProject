//is used as the base url address on which xmlhttp GET requests are sent
var BASE_URL = 'http://127.0.0.1:5000'
/* cache variable  at the client side - JSON that stores the data needed to plot
the graphs once and uses it after without requesting from the server*/
var cache = {};
// execute the cache-cleaning method at the loading time of the file at client side
clearCache();
/*function that clears the cache at every 10 minutes(is per client session)*/
function clearCache() {
    cache = {};
    //repeat the cleaning at some fixed interval
    setTimeout(clearCache, 1000 * 60 * 10);
}

/*GET request to the server that takes the data necessary for plotting "functions" and the
 * argmuent in case some part of data is requested by the user (only one aircraft for example)
 * this function also takes the cachetype which is the key of the element of the cache where this
 * particular graph data is stored
 */
function getJSON(path, functions, argument, cachetype) {

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

/*send the uploaded file contents on a POST to the server
 *and get back from server the id of the new aircraft resulted from predictions
 */
function sendTestingInputFile() {
    var fileSelect = document.getElementById("file-select");
    var myFormData = new FormData();
    myFormData.append('thefile', fileSelect.files[0]);
    $.ajax({
        url: '/send',
        type: 'POST',
        processData: false, // important
        contentType: false, // important
        dataType: 'json',
        data: myFormData,
        success: [function (response) { addNewAircraftItems(response);
         alert("New aircraft just added: " + response);}]
    });
}
/*sends a async GET to the server on some url, with some arguments
 *and applying the callback function on the server's response content
 */
function httpGetAsync(theUrl, callback, argument) {
    // var url = BASE_URL + theUrl + "?" + argument;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl + argument, true); // true for asynchronous
    xmlHttp.send(null);
}


/*choose graph by id and get its plot data either from the cache or request it from the server
 * then call its rendering method
 */
function showGraph(idGraph) {
    /*hide the right elements and show the graphContainer so the graph will appear on the page*/
    $("#tilesContainer").hide();

    if (idGraph == 1) {
        if (cache['data_dust'] == undefined)
            getJSON('/dustExposureGraph', dust_per_cycle_Graph, "", 'data_dust');
        else
            dust_per_cycle_Graph(cache['data_dust']);
    }
    if (idGraph == 3) {
        if (cache['data_histogram'] == undefined)
            getJSON('/histogram', histogramCycles, "", 'data_histogram');
        else
            histogramCycles(cache['data_histogram']);
    }
    if (idGraph == 2) {
        if (cache['data_dust_variation'] == undefined)
            getJSON('/dustVariation', dustVariation, "", 'data_dust_variation');
        else
            dustVariation(cache['data_dust_variation']);
    }
    if (idGraph == 4) {
        if (cache['fail_percent_chance'] == undefined)
            getJSON('/failchance', failureChance, "", 'fail_percent_chance');
        else
            failureChance(cache['fail_percent_chance']);
    }
    if (idGraph == 5) {
        if (cache['remaining_cycles'] == undefined)
            getJSON('/remainingCycles', remainingCyclesNow, "", 'remaining_cycles');
        else
            remainingCyclesNow(cache['remaining_cycles']);
    }

    $("#graphContainer").show();
}

/* show back to the menu of the mainContainer by hidding the current displayed graph
 * which is in graphContainer
 */
function showGraphsPanel() {
    /*hide all the HTML elements of the "Predictions" panel*/
    $("#predictionsPanel").hide();
    $("#aircraftPanel").hide();
    $("#graphContainer").hide();

    $("#graphsPanel").show();
    $("#tilesContainer").show();
}

function showPredictionsPanel() {

    showRiskGraph();
    $("#graphsPanel").hide();
    $("#aircraftPanel").hide();
    $("#predictionsPanel").show();
}

function showAircraftListPanel() {
    $("#graphsPanel").hide();
    $("#predictionsPanel").hide();
    $("#aircraftPanel").show();
}

function showRiskGraph() {
    if (cache['data_risk_graph'] == undefined)
        getJSON('/riskGraph', riskPlot, "", 'data_risk_graph');
    else
        riskPlot(cache['data_risk_graph']);
}

//PLOTS THE RISK GRAPH THAT SHOWS FOR A PARTICULAR ENGINE GIVEN AS INPUT BY THE USER
function specificRiskGraph() {
    var text = "?engine=" + document.getElementById("searchAircraft").value;
    getJSON('/specificRiskData', riskPlot, text);
}

//PLOTS THE RISK GRAPH THAT SHOWS FOR EACH ENGINE THE FAILURE DATE IN A VISUAL WAY
function riskPlot(data) {
    var chart = AmCharts.makeChart("riskGraphContainer", {
        "type": "gantt",
        "theme": "light",
        "marginRight": 70,
        "columnWidth": 0.5,
        "gradientOrientation": "vertical",
        "valueAxis": [{
            "type": "value",
            "title": "Cycle"
        }],
        "categoryAxis": {
            "title": "Individual aircrafts"
        },
        "brightnessStep": 10,
        "graph": {
            "fillAlphas": 1,
            "balloonText": "<b>[[task]]</b>: [[open]] [[value]]"
        },
        "rotate": true,
        "categoryField": "category",
        "segmentsField": "segments",
        "colorField": "color",
        "startDate": "0",
        "startField": "start",
        "endField": "end",
        "durationField": "duration",
        "dataProvider": data,
        "valueScrollbar": {
            "autoGridCount": true
        },
        "chartCursor": {
            "cursorColor": "#55bb76",
            "valueBalloonsEnabled": false,
            "cursorAlpha": 0,
            "valueLineAlpha": 0.5,
            "valueLineBalloonEnabled": true,
            "valueLineEnabled": true,
            "zoomable": false,
            "valueZoomable": true
        },
        "export": {
            "enabled": true
        }
    });
}

//PLOTS THE DUST VARIATION GRAPH: MEAN AND RANGE PER CYCLE
function dustVariation(data) {
    var len = data.length;
    var average = [];
    for (i = 0; i < len; i++) {
        var elem = [data[i][0], data[i][3]];
        average.push(elem);
    }
    Highcharts.chart('graphContainer', {

        title: {
            text: 'Dust exposure'
        },
        yAxis: {
            title: {
                text: null
            }
        },

        tooltip: {
            crosshairs: true,
            shared: true,

        },

        legend: {},

        series: [

            {
                name: 'Mean dust amount',
                data: average,
                zIndex: 1,
                marker: {
                    fillColor: 'white',
                    lineWidth: 2,
                    lineColor: Highcharts.getOptions().colors[0]
                }
            }, {
                name: 'Range',
                data: data,
                type: 'arearange',
                lineWidth: 0,
                linkedTo: ':previous',
                color: Highcharts.getOptions().colors[0],
                fillOpacity: 0.3,
                zIndex: 0,
                marker: {
                    enabled: false
                }
            }]
    });
}

//PLOTS A HISTOGRAM WITH THE PREDICTED,WORKING UNTIL KNOW AND TOTAL FOR EACH ENGINE
function histogramCycles(data) {

    Highcharts.chart('graphContainer', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Distribution of cycles'
        },
        xAxis: {
            categories: [
                'engine1',
                'engine2',
                'engine3',
                'engine4',
                'engine5',

            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Cycles number'
            }
        },
        colors: ['#35508F', '#3A5DAD', '#253355'],
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: data
    });
}

//PLOTS AN AREA GRAPH OF THE DUST EXPOSURE PER CYCLE
function dust_per_cycle_Graph(data) {

    Highcharts.chart('graphContainer', {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'Dust exposure on cycle number'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        },
        xAxis: {
            title: {
                text: 'Cycle number'
            },
            type: 'linear'
        },
        yAxis: {
            title: {
                text: 'Dust amount'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: 0
            }
        },

        series: [{
            type: 'area',
            name: 'Dust at cycle:',
            data: data
        }]
    });
}

function failureChance(data) {
    // Data generated from http://www.bikeforums.net/professional-cycling-fans/1113087-2017-tour-de-france-gpx-tcx-files.html


// Now create the chart
    Highcharts.chart('graphContainer', {

        chart: {
            type: 'area',
            zoomType: 'x',
            panning: true,
            panKey: 'shift'
        },

        title: {
            text: 'Chance of failure '
        },

        subtitle: {
            text: 'based on cycle number'
        },


        xAxis: {
            labels: {
                format: '{value}'
            },
            minRange: 5,
            title: {
                text: 'Chance'
            }
        },

        yAxis: {
            startOnTick: true,
            endOnTick: false,
            maxPadding: 0.35,
            title: {
                text: null
            },
            labels: {
                format: '{value} %'
            }
        },

        tooltip: {
            headerFormat: 'Cycle: {point.x:.1f}  <br>',
            pointFormat: ' Chance of failure {point.y}%',
            shared: true
        },

        legend: {
            enabled: false
        },

        series: [{
            data: data,
            lineColor: Highcharts.getOptions().colors[1],
            color: Highcharts.getOptions().colors[2],
            fillOpacity: 0.5,
            name: 'Elevation',
            marker: {
                enabled: false
            },
            threshold: null
        }]

    });

}

function remainingCyclesNow(data) {

    Highcharts.chart('graphContainer', {
        chart: {
            type: 'spline',
            inverted: false
        },
        title: {
            text: 'Remaining useful cycles'
        },
        subtitle: {
            text: 'According to the working        cycles until now'
        },
        xAxis: {
            reversed: false,
            title: {
                enabled: true,
                text: 'Current cycle'
            },
            labels: {
                format: '{value} '
            },
            maxPadding: 0.05,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: 'Remaining predicted cycles'
            },
            labels: {
                format: '{value}'
            },
            lineWidth: 2
        },
        legend: {
            enabled: false
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: '{point.x} -{point.y}'
        },
        plotOptions: {
            spline: {
                marker: {
                    enable: false
                }
            }
        },
        series: [{
            name: 'Current-Remaining ',
            data: data
        }]
    });

}

/*add all the database aircrafts to lists and add listeners to both lists */
function onStartFillLists(aircraftList) {
    addAircraftItems(aircraftList);
    addListenersToDropdownItems();
    addListenersToListItems();
}

/*fills the lists with the list of aircrafts already in the database on web page open*/
function addAircraftItems(data) {
    for (i = 0; i < data.length; i++) {
         addNewAircraftItems(data[i]);
    }
}

/* adds event listener on the list of Aircrafts panel so it handles dynamically added items*/
function addListenersToListItems() {
     var dropmenu = document.getElementById('itemlist');
    dropmenu.addEventListener("click", function (e) {

        if (e.target && e.target.matches("li.highlight-on-hover")) {
             showGraphsPanel();
            document.getElementById("tab2").checked = true;
            event.preventDefault();
            var argument = "?engine=" + e.target.innerHTML;
            httpGetAsync("/newEngineRequested", alert, argument);
        }
    });
}

/* adds event listener on the dropdown of Graphs panel so it handles dynamically added items*/
function addListenersToDropdownItems() {
    var dropmenu = document.getElementById('dropDownList');
    dropmenu.addEventListener("click", function (e) {
        if (e.target && e.target.matches("li.highlight-on-hover")) {
             event.preventDefault();
            var argument = "?engine=" + e.target.innerHTML;
            httpGetAsync("/newEngineRequested", alert, argument);
        }
    });
}

/*takes an aircraft id and adds it to the list and dropdown- after new testing data is uploaded and predictions computed */
function addNewAircraftItems(newAircraft) {
    document.getElementById('dropDownList').innerHTML += "<li class = \"highlight-on-hover\">" + newAircraft + "</li>";
    document.getElementById('itemlist').innerHTML += "<li class = \"highlight-on-hover\">" + newAircraft + "</li>";
}











