import os
import csv

try: # Windows needs stdio set for binary mode.
     import msvcrt
     msvcrt.setmode (0, os.O_BINARY) # stdin  = 0
     msvcrt.setmode (1, os.O_BINARY) # stdout = 1
except ImportError:
    pass

import backendController
from flask import Flask, jsonify, render_template, request
from backendController import *
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
            "task": "Still working"
        }, {
            "duration": 2,
            "color": "#727d6f",
            "task": "Needs maintenance"
        }, {
            "duration": 2,
            "color": "#8dc49f",
            "task": "Failing"
        } ]
    }, {
        "category": "Aircraft2",
        "segments": [ {
            "start": 13,
            "duration": 2,
            "color": "#727d6f",
            "task": "Still working"
        }, {
            "duration": 1,
            "color": "#8dc49f",
            "task": "Needs maintenance"
        }, {
            "duration": 4,
            "color": "#46615e",
            "task": "Failing"
        } ]
    }, {
        "category": "Aircraft3",
        "segments": [ {
            "start": 25,
            "duration": 3,
            "color": "#727d6f",
            "task": "Still working"
        }, {
            "duration": 4,
            "color": "#FFE4C4",
            "task": "Needs maintenance"
        },
            {
            "duration": 4,
            "color": "#46615e",
            "task": "Failing"
        } ]
    } ]
#data for the histogram (working-predicted cycles) plot
histogram_data = [{
        "name": 'Working',
        "data": [20,22,12,15,32]

    }, {

        "name": 'Predicted until failure',
        "data": [16,22,30,20,10]

    }, {
        "name": 'Total',
        "data": [36,44,42,35,42]

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
sensorValues = ["1", "0.0023", "0.0003", "100.0", "518.67", "643.02", "1585.29", "1398.21", "14.62", "21.61", "553.9",
                "2388.04","9050.17", "1.3", "47.2", "521.72", "2388.03", "8125.55", "8.4052",
                "0.03", "392", "2388", "100.0", "38.86","23.3735", "0.0", "0.0", "518.67", "643.02", "1585.29", "1398.21",
                "14.62", "21.61", "553.9", "2388.04", "9050.17", "1.3", "47.2", "521.72", "2388.03", "8125.55", "8.4052",
                "0.03", "392", "2388", "100.0", "38.86","23.3735", "0.0", "0.0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
                "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]
failChance_per_cycle  = [
        [0.0, 225],
        [0.1, 226],
        [0.2, 228],
        [0.3, 228],
        [0.4, 229],
        [0.5, 229],
        [0.6, 230],
        [0.7, 234],
        [0.8, 235],
        [0.9, 236],
        [1.0, 235],
        [1.1, 232],
        [1.2, 228],
        [1.3, 223],
        [1.4, 218],
        [1.5, 214],
        [1.6, 207],
        [1.7, 202],
        [1.8, 198],
        [1.9, 196],
        [2.0, 197],
        [2.1, 200],
        [2.2, 205],
        [2.3, 206],
        [2.4, 210],
        [2.5, 210],
        [2.6, 210],
        [2.7, 209],
        [2.8, 208],
        [2.9, 207],
        [3.0, 209],
        [3.1, 208],
        [3.2, 207],
        [3.3, 207],
        [3.4, 206],
        [3.5, 206],
        [3.6, 205],
        [3.7, 201],
        [3.8, 195],
        [3.9, 191],
        [4.0, 191],
        [4.1, 195],
        [4.2, 199],
        [4.3, 203],
        [4.4, 208],
        [4.5, 208],
        [4.6, 208],
        [4.7, 208],
        [4.8, 209],
        [4.9, 207],
        [5.0, 207],
        [5.1, 208],
        [5.2, 209],
        [5.3, 208],
        [5.4, 210],
        [5.5, 209],
        [5.6, 209],
        [5.7, 206],
        [5.8, 207],
        [5.9, 209],
        [6.0, 211],
        [6.1, 206],
        [6.2, 201],
        [6.3, 199],
        [6.4, 200],
        [6.5, 202],
        [6.6, 203],
        [6.7, 202],
        [6.8, 204],
        [6.9, 206],
        [7.0, 208],
        [7.1, 205],
        [7.2, 202],
        [7.3, 198],
        [7.4, 198],
        [7.5, 198],
        [7.6, 198],
        [7.7, 198],
        [7.8, 199],
        [7.9, 197],
        [8.0, 194],
        [8.1, 194],
        [8.2, 195],
        [8.3, 195],
        [8.4, 196],
        [8.5, 192],
        [8.6, 200]]

@app.route("/")
def main():
    return render_template('main_screen.html')

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

@app.route('/failchance', methods=['GET', 'POST'])
def fail_chance():
        if request.method == 'GET':
            return jsonify(failChance_per_cycle)

@app.route('/send', methods=['POST','GET'])
def up_file():
    if request.method == 'POST':
        data = request.files['thefile'].read()
        csvString = data.decode("utf-8")
        print (csvString )
     #   predictions = backendController.getMultiClassPredictorForCSVdata(csvString)
        return jsonify(histogram_data)

if __name__ == "__main__":
     app.run(debug=True)