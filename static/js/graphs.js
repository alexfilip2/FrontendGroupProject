var BASE_URL = 'http://127.0.0.1:5000'

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
                    text: 'USD to EUR exchange rate over time'
                },
                subtitle: {
                    text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
                },
                xAxis: {
                    type: 'linear'
                },
                yAxis: {
                    title: {
                        text: 'Exchange rate'
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
                    name: 'USD to EUR',
                    data: data
                }]
            });

}
function graphPredicton() {

    Highcharts.chart('graphContainer', {
        chart: {
            type: 'xrange'
        },
        title: {
            text: 'Risk plot'
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'}
        },
        yAxis: {
            title: {
                text: ''
            },
            categories: ['Prototyping', 'Development', 'Testing'],
            reversed: true
        },
        series: [{
            name: 'Timeline',
            // pointPadding: 0,
            // groupPadding: 0,
            borderColor: 'gray',
            pointWidth: 20,
            data: [{
                x: Date.UTC(2014, 11, 1),
                x2: Date.UTC(2018, 11, 6),
                y: 0,
                partialFill: 0.9
            }, {
                x: Date.UTC(2014, 11, 2),
                x2: Date.UTC(2017, 11, 5),
                y: 1
            }, {
                x: Date.UTC(2014, 11, 8),
                x2: Date.UTC(2018, 11, 9),
                y: 2
            }, {
                x: Date.UTC(2014, 11, 9),
                x2: Date.UTC(2014, 11, 19),
                y: 1
            }, {
                x: Date.UTC(2014, 11, 10),
                x2: Date.UTC(2014, 11, 23),
                y: 2
            }],
            dataLabels: {
                enabled: true
            }
        }]

    });
}
//choose between graphs and draw it by hidding the tiles from the mainContainer
function showGraph(idGraph) {

    $("#tilesContainer").hide();
    $("#graphContainer").show();

        if (idGraph == 1) getJSON('/dataGraph',graph1);
        if (idGraph == 2) {
            graphPredicton();
            $("#stats_predic_Container").show();
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

