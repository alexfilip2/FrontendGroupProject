import  os
import csv
import backendController
try: # Windows needs stdio set for binary mode.
     import msvcrt
     msvcrt.setmode (0, os.O_BINARY) # stdin  = 0
     msvcrt.setmode (1, os.O_BINARY) # stdout = 1
except ImportError:
    pass

from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

import urllib.request, json
#data for the first tile plot
url = urllib.request.urlopen("https://cdn.rawgit.com/highcharts/highcharts/v6.0.5/samples/data/usdeur.json")
dust_exposure_data = json.loads(url.read().decode())
#data for the risk (when engines will fail on a horizontal stacked bar) plot
risk_graph_data = [ {
        "category": "Aircraft1",
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
        "category": "Aircraft2",
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
        "category": "Aircraft3",
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
    } ]
#data for the risk (working-predicted cycles) plot
histogram_data = [{
        "name": 'Working',
        "data": [49.9, 71.5, 106.4, 129.2, 144.0]

    }, {

        "name": 'Predicted until failure',
        "data": [83.6, 78.8, 98.5, 93.4, 106.0]

    }, {
        "name": 'Total',
        "data": [48.9, 38.8, 39.3, 41.4, 47.0]

    }]
#data for the failure chance on dust plot
dust_data =[
        [1, 14.3, 27.7, 21.5],
        [2, 14.5, 27.8 , 22.1],
        [2, 15.5, 29.6, 20],
        [3, 16.7, 30.7, 20],
        [3, 16.5, 25.0, 21],
        [5, 17.8, 25.7, 18],
        [6, 13.5, 24.8, 23],
        [6, 10.5, 21.4, 12],
        [8, 9.2, 23.8, 10],
        [12, 11.6, 21.8,15],
        [15, 10.7, 23.7,16],
        [15, 11.0, 23.3,17] ]
aircraft_list =  ["frsr","feasrd1","erdbf"]

@app.route("/")
def main():
    return render_template('main_screen.html', itemslist = aircraft_list)

@app.route('/dustExposureGraph', methods=['GET', 'POST'])
def first_tile_graph():
    if request.method == 'GET':
             return  jsonify(dust_exposure_data)

@app.route('/riskGraph', methods=['GET', 'POST'])
def risk_graph_upload():
    if request.method == 'GET':
             return  jsonify(risk_graph_data)
@app.route('/riskGraphArg', methods=['GET', 'POST'])
def rerender_risk():
    if request.method == 'GET':
        tosend =[]
        aircraft =request.args.get('engine')
        for elem in risk_graph_data:
            if elem['category'] == aircraft:
                tosend.append(elem)
        return  jsonify(tosend)

@app.route('/histogram', methods=['GET', 'POST'])
def second_tile_graph():
    if request.method == 'GET':
             return  jsonify(histogram_data)

@app.route('/dustVariation', methods=['GET', 'POST'])
def third_tile_graph():
    if request.method == 'GET':
             return  jsonify(dust_data)


@app.route('/send', methods=['POST'])
def upload():
    if request.method == 'POST':
        file = request.files['thefile'].read()
        csvString = file.decode("utf-8")
        print (backendController.getMultiClassPredictorForCSVdata(csvString))
        return  jsonify(dust_data)

if __name__ == "__main__":
     app.run(debug=True)
