function plotRiskGraph(data) {
    var chart = AmCharts.makeChart("comparisonGraphContainer", {
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
            "title": "Individual aircrafts ID's"
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

function plotRULVariationGraph(data) {
    var len = data.length;
    var average = [];
    for (i = 0; i < len; i++) {
        var elem = [data[i][0], data[i][3]];
        average.push(elem);
    }
    Highcharts.chart('graphContainer', {

        title: {
            text: 'Predicted number of remaining working cycles'
        },
        subtitle: {
            text: 'given the current cycle'
        },
        yAxis: {
            title: {
                text: 'Predicted number of cycles before failure'
            }
        },
        xAxis: {
            title: {
                text: 'Current cycle number'
            }
        },

        tooltip: {
            crosshairs: true,
            shared: true,
        },

        legend: {},

        series: [
            {
                name: 'Predicted RUL',
                data: average,
                zIndex: 1,
                marker: {
                    fillColor: 'white',
                    lineWidth: 2,
                    lineColor: Highcharts.getOptions().colors[0]
                }
            }, {
                name: 'Bounds of prediction: ',
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
    aircrafts = (SELECTEDAIRCRAFTS.sort().length == 0) ? (AIRCRAFTLIST.map(x => x.split(" ")[1])
).
    slice(0, 10)
:
    SELECTEDAIRCRAFTS;
    Highcharts.chart('comparisonGraphContainer', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Distribution of cycles'
        },
        xAxis: {
            categories: aircrafts,
            title: {
                text: "Aircrafts IDs"
            }

        },
        yAxis: {
            min: 0,
            title: {
                text: 'Number of cycles'
            }
        },
        colors: ['#35508F', '#3A5DAD', '#253355'],
        tooltip: {
            headerFormat: '<span style="font-size:16px"> Aircraft number: {point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} cycles</b></td></tr>',
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

function dustExposureGraph(data) {
    Highcharts.chart('graphContainer', {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'Dust exposure against cycles'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        },
        xAxis: {
            min: 0,
            title: {
                text: 'Cycle Number'
            },
            type: 'linear'
        },
        yAxis: {
            floor: 0,
            title: {
                text: 'Dust (grams per square metre)'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            headerFormat: '<span style="font-size:13px"> Cycle number: {point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} grams</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
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
            name: 'Dust:',
            data: data
        }]
    });
}

function dustAccumulationGraph(data) {
    Highcharts.chart('graphContainer', {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'Dust Accumulation against cycles'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        },
        xAxis: {
            min: 0,
            title: {
                text: 'Cycle Number'
            },
            type: 'linear'
        },
        yAxis: {
            floor: 0,
            title: {
                text: 'Dust (grams per square metre)'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            headerFormat: '<span style="font-size:13px"> Cycle number: {point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} grams</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
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
            name: 'Dust:',
            data: data
        }]
    });
}

function failureChance(data) {
    Highcharts.chart('graphContainer', {

        chart: {
            type: 'area',
            zoomType: 'x',
            panning: true,
            panKey: 'shift'
        },

        title: {
            text: 'Probability of failure '
        },

        subtitle: {
            text: 'within the next X cycles'
        },


        xAxis: {
            labels: {
                format: '{value}'
            },
            minRange: 5,
            title: {
                text: 'Within the next X cycles'
            }
        },

        yAxis: {
            floor: 0,
            ceiling: 100,
            startOnTick: true,
            endOnTick: false,
            maxPadding: 0.35,
            title: {
                text: 'Probability of Engine Failure'
            },
            labels: {
                format: '{value} %'
            }
        },

        tooltip: {
            headerFormat: ' Working cycles so far: {point.x:.1f}  <br>',
            pointFormat: ' Chance of failure {point.y}%',
            shared: true
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
                    fillOpacity: 0.5,
                    stops: [
                        [0, '#AE002C'],
                        [1, '#45AD3A']
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
                threshold: 50
            }
        },

        series: [{
            data: data,
            lineColor: Highcharts.getOptions().colors[0],
            color: 'black',
            fillOpacity: 0.5,
            name: 'Elevation',
            marker: {
                enabled: false
            },
            threshold: null
        }]

    });

}

function RULwithDust(data) {
    values = data[0].map(function (elt) {
        return elt[1];
    });
    ub = Math.max.apply(null, values)
    lb = Math.min.apply(null, values)
    lb = 1.5 * lb - 0.5 * ub
    values = data[1].map(function (elt) {
        return elt[1];
    });
    dustUb = Math.max.apply(null, values) * 3
    Highcharts.chart('graphContainer', {
        title: {
            text: 'Predicted number of cycles before failure'
        },
        subtitle: {
            text: 'Dust data'
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
        yAxis: [{ // Primary yAxis
            min: lb,
            max: ub,
            title: {
                text: 'Remaining predicted cycles'
            },
            labels: {
                format: '{value}'
            },
            lineWidth: 2
        }, { // Secondary yAxis
            floor: 0,
            max: dustUb,
            title: {
                text: 'Dust',
            },
            labels: {
                format: '{value} grams'
            },
            opposite: true
        }],
        legend: {
            enabled: false
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: '{point.x}, {point.y:.1f}'
        },
        plotOptions: {
            spline: {
                marker: {
                    enable: false
                }
            }
        },
        series: [{
            type: 'spline',
            name: 'Cycle, Remaining',
            data: data[0]
        }, {
            type: 'area',
            name: 'Cycle, Dust (g): ',
            yAxis: 1,
            data: data[1]
        }]
    });
}