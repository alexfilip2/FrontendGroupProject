var BASE_URL = 'http://127.0.0.1:5000'





function riskPlot(){
var chart = AmCharts.makeChart( "graphContainer", {
    "type": "gantt",
    "theme": "light",
    "marginRight": 70,
    "period": "DD",
    "dataDateFormat":"YYYY-MM-DD",
    "balloonDateFormat": "JJ:NN",
    "columnWidth": 0.5,
    "valueAxis": {
        "type": "date"
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
    "startDate": "2015-01-01",
    "startField": "start",
    "endField": "end",
    "durationField": "duration",
    "dataProvider": [ {
        "category": "Alan",
        "segments": [ {
            "start": 17,
            "duration": 2,
            "color": "#46615e",
            "task": "Task #1"
        }, {
            "duration": 2,
            "color": "#727d6f",
            "task": "Task #2"
        }, {
            "duration": 2,
            "color": "#8dc49f",
            "task": "Task #3"
        } ]
    }, {
        "category": "Ruth",
        "segments": [ {
            "start": 13,
            "duration": 2,
            "color": "#727d6f",
            "task": "Task #2"
        }, {
            "duration": 1,
            "color": "#8dc49f",
            "task": "Task #3"
        }, {
            "duration": 4,
            "color": "#46615e",
            "task": "Task #1"
        } ]
    }, {
        "category": "Simon",
        "segments": [ {
            "start": 40,
            "duration": 3,
            "color": "#727d6f",
            "task": "Task #2"
        }, {
            "start": 17,
            "duration": 4,
            "color": "#FFE4C4",
            "task": "Task #4"
        } ]
    } ],
    "valueScrollbar": {
        "autoGridCount":true
    },
    "chartCursor": {
        "cursorColor":"#55bb76",
        "valueBalloonsEnabled": false,
        "cursorAlpha": 0,
        "valueLineAlpha":0.5,
        "valueLineBalloonEnabled": true,
        "valueLineEnabled": true,
        "zoomable":false,
        "valueZoomable":true
    },
    "export": {
        "enabled": true
     }
} );
}
 function getJSON(path,functions) {
            url = BASE_URL + path;
            xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);

            xhr.onreadystatechange = function () {
                if (xhr.status == 200) {
                    if (!xhr.response) return;
                    var obj = JSON.parse(xhr.response);
                    functions(obj);

                }
             };
            xhr.send(null);
 }


 function failurePointOnDust() {

    Highcharts.chart('graphContainer', {
    chart: {
        type: 'line'
    },
    title: {
        text: 'Chance of failure (applying to any aircfrat)'

    },
    subtitle: {
        text: 'Depending on working cycles'
    },
    xAxis: {
        categories: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
    },
    yAxis: {
        title: {
            text: 'Chance in percentage'
        }
    },
    plotOptions: {
        line: {
            dataLabels: {
                enabled: true
            },
            enableMouseTracking: false
        }
    },
    series: [
    {
        name: 'Working cycles',
        data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
    }]
});

 }



 function  histoCycles() {

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
    series: [{
        name: 'Working',
        data: [49.9, 71.5, 106.4, 129.2, 144.0]

    }, {
        /*data has lenght of how many engines are plotted*/
        name: 'Predicted until failure',
        data: [83.6, 78.8, 98.5, 93.4, 106.0]

    }, {
        name: 'Total',
        data: [48.9, 38.8, 39.3, 41.4, 47.0]

    }]
});

 }

// draw the first graph into container graphContainer located in main_screen.html
function graph1(data) {
/*$.getJSON(
    'https://cdn.rawgit.com/highcharts/highcharts/v6.0.5/samples/data/usdeur.json',
    function (data) { console.log(data);}); */


            Highcharts.theme;

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

//choose between graphs and draw it by hidding the tiles from the mainContainer
function showGraph(idGraph) {

    $("#tilesContainer").hide();
    $("#graphContainer").show();

        if (idGraph == 1) getJSON('/dataGraph',graph1);
        if (idGraph == 2) {
            riskPlot();
            $("#stats_predic_Container").show();
        }
        if(idGraph ==3)
        {
            histoCycles();
        }
        if(idGraph ==4)
        {
            failurePointOnDust();
        }

}
// go back to the menu of the mainContainer by hidding the current displayed graph
// which is in graphContainer
function back() {
    $("#graphContainer").hide();
    $("#stats_predic_Container").hide()
    $("#tilesContainer").show();

}
function csvJSON(csv){

    var lines=csv.split("\n");

    var result = [];

    var headers=lines[0].split(",");

    for(var i=1;i<lines.length;i++){

        var obj = {};
        var currentline=lines[i].split(",");

        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);

    }

    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
}

