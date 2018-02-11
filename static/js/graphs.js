var BASE_URL = 'http://127.0.0.1:5000'

function riskPlot(data){
var chart = AmCharts.makeChart("graphContainer", {
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
    "dataProvider": data,
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

    legend: {
    },

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


 function  histoCycles(data) {
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

// draw the first graph into container graphContainer located in main_screen.html
function dustGraph(data) {


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

        if (idGraph == 1) getJSON('/dustExposureGraph',dustGraph,"");
        if (idGraph == 5) {
            getJSON('/riskGraph',riskPlot,"");
            $("#searchBox").show();

            $("#stats_predic_Container").show();
        }
        if(idGraph ==3)
        {
            getJSON('/histogram',histoCycles,"");

        }
        if(idGraph ==4)
        {
            getJSON('/dustVariation',dustVariation,"");
        }

}
// go back to the menu of the mainContainer by hidding the current displayed graph
// which is in graphContainer
function back() {
    $("#graphContainer").hide();
    $("#stats_predic_Container").hide()
    $("#searchBox").hide()

    $("#tilesContainer").show();

}
function getJSON(path,functions,argument) {


            url = BASE_URL + path;
            xhr = new XMLHttpRequest();
            xhr.open("GET", url+ argument, true);

            xhr.onreadystatechange = function () {
                if (xhr.status == 200) {
                    if (!xhr.response) return;

                    var obj = JSON.parse(xhr.response);
                    functions(obj);

                }
             };
            xhr.send(null);
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

function textDisplay() {

       var text = document.getElementById("textInput").value;

    alert(text);

}
function riskPlotRerender() {

     var text = "?engine="+ document.getElementById("textInput").value;
     alert(text);
     getJSON('/riskGraphArg',riskPlot,text);



}