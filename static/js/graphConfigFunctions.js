function plotRiskGraph(data) {
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

function plotDustVariationGraph(data) {
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

function plotDistributionOfCyclesGraph(data) {
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
