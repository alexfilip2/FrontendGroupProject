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
remaining_cycles = [[0, 15], [10, -50], [20, -56.5], [30, -46.5], [40, -22.1],
                [50, -2.5], [60, -27.7], [70, -55.7], [80, -76.5]]
aircraft = 2

@app.route('/', methods=['GET'])
def main():
    return render_template('main_screen.html', itemslist = backendController.getAircraftList())

@app.route('/dustExposureGraph', methods=['GET'])
def first_tile_graph():
    return jsonify(backendController.getDustExposureData(aircraft))

@app.route('/remainingCycles', methods=['GET'])
def fifth_tile_graph():
    remaining_cycles = backendController.getRULs(aircraft)
    return jsonify(remaining_cycles)

@app.route('/histogram', methods=['GET'])
def second_tile_graph():
        return jsonify(backendController.getLifeDistHistogram())

@app.route('/failchance', methods=['GET'])
def fourth_tile_graph():
        return jsonify(backendController.getFailureProbs(aircraft))

@app.route('/RULVariation', methods=['GET'])
def third_tile_graph():
        return jsonify(backendController.getRULs(aircraft))

@app.route('/riskGraph', methods=['GET'])
def risk_graph_upload():

        return jsonify( backendController.getRiskGraphData())

@app.route('/specificRiskData', methods=['GET'])
def render_specific_risk():
        aircraftID = request.args.get('engine')

        return jsonify(backendController.getRiskGraphData([aircraftID]))

@app.route('/newEngineRequested', methods=['GET'])
def new_engine_request():
        global aircraft
        aircraft = request.args.get('engine')
        return 'The engine selected: ' + aircraft + ' was processed by the server'

@app.route('/send', methods=['GET','POST'])
def upload():
    if request.method == 'POST':
        file = request.files['thefile'].read()
        csvString = file.decode("utf-8")
        backendController.getMultiClassPredictorForCSVdata(csvString)
        new_aircraft = 'Aircraft22'
        return jsonify(new_aircraft)

if __name__ == "__main__":
     app.run(debug=True)