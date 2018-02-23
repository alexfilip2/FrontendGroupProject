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

MODELAPITHREADS = []
aircraft = 2

@app.route('/', methods=['GET'])
def main():
    return render_template('main_screen.html', itemslist = backendController.getAircraftList())

@app.route('/dustExposureGraph', methods=['GET'])
def getDustExposure():
    return jsonify(backendController.getDustExposureData(aircraft))

@app.route('/dustAccumulationGraph', methods=['GET'])
def getDustAccumulation():
    return jsonify(backendController.getAccumulatedDustData(aircraft))
    
@app.route('/rulWithDust', methods=['GET'])
def getRULWithDust():
    return jsonify(backendController.getRULwithDust(aircraft))

@app.route('/histogram', methods=['GET'])
def getHistogram():
        return jsonify(backendController.getLifeDistHistogram())

@app.route('/multiChoice', methods=['POST'])
def choice():
        choices = request.form['choices'].split(",")
        graphType = request.args.get('type')
        if graphType =='histo' :
            return jsonify(backendController.getLifeDistHistogram(choices))
        else:
            return jsonify(backendController.getRiskGraphData(choices))

@app.route('/failchance', methods=['GET'])
def getFailChance():
        return jsonify(backendController.getFailureProbs(aircraft))

@app.route('/RULVariation', methods=['GET'])
def getRULVariation():
        return jsonify(backendController.getRULs(aircraft))

@app.route('/riskGraph', methods=['GET'])
def getRiskGraph():
        return jsonify( backendController.getRiskGraphData())

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
        try: 
            MODELAPITHREADS = backendController.updateDatabaseWithCSV(csvString)
        except Exception as e:
            print(e) #Missing column data
        new_aircraft = 'Aircraft22'
        return jsonify(new_aircraft)

if __name__ == "__main__":
     app.run(debug=True)