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
fail_chance = [
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
    [7.1, 205],]
aircraft_list =  ["frsr","feasrd1","erdbf"]

@app.route("/")
def main():
    return render_template('main_screen.html', itemslist = getAircraftList())

@app.route('/dustExposureGraph', methods=['GET', 'POST'])
def first_tile_graph():
    if request.method == 'GET':
             return  jsonify(dust_exposure_data)

@app.route('/riskGraph', methods=['GET', 'POST'])
def risk_graph_upload():
    if request.method == 'GET':
             return  jsonify(getRiskGraphData())
@app.route('/riskGraphArg', methods=['GET', 'POST'])
def rerender_risk():
    if request.method == 'GET':
        tosend =[]
        aircraft =request.args.get('engine')
        for elem in getRiskGraphData():
            if elem['category'] == aircraft:
                tosend.append(elem)
        return  jsonify(tosend)

@app.route('/histogram', methods=['GET', 'POST'])
def second_tile_graph():
    if request.method == 'GET':
             return  jsonify(getLifeDistHistogram())

@app.route('/dustVariation', methods=['GET', 'POST'])
def third_tile_graph():
    if request.method == 'GET':
             return  jsonify(getRULs(2))
     
@app.route('/failchance', methods=['GET', 'POST'])
def fourth_tile_graph():
    if request.method == 'GET':
             return  jsonify(getFailureProbs(2))

@app.route('/send', methods=['POST'])
def upload():
    if request.method == 'POST':
        file = request.files['thefile'].read()
        csvString = file.decode("utf-8")
        print (backendController.getMultiClassPredictorForCSVdata(csvString))
        return  jsonify(dust_data)

if __name__ == "__main__":
     app.run(debug=True)
