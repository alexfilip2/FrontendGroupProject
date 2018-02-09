import   os
import csv
from backendController import *

try: # Windows needs stdio set for binary mode.
    import msvcrt
    msvcrt.setmode (0, os.O_BINARY) # stdin  = 0
    msvcrt.setmode (1, os.O_BINARY) # stdout = 1
except ImportError:
    pass

from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

import urllib.request, json

url = urllib.request.urlopen("https://cdn.rawgit.com/highcharts/highcharts/v6.0.5/samples/data/usdeur.json")
graph_data = json.loads(url.read().decode())


@app.route("/")
def main():
    print("main")
    return render_template('main_screen.html')

@app.route('/dataGraph', methods=['GET', 'POST'])
def upload_file():
        print("upload")
        if request.method == 'GET':
            sensorValues=["1", "0.0023", "0.0003", "100.0", "518.67", "643.02", "1585.29", "1398.21", "14.62", "21.61", "553.9", "2388.04",
                                "9050.17", "1.3", "47.2", "521.72", "2388.03", "8125.55", "8.4052", "0.03", "392", "2388", "100.0", "38.86",
                                "23.3735", "0.0", "0.0","518.67", "643.02", "1585.29", "1398.21", "14.62", "21.61", "553.9", "2388.04",
                                "9050.17", "1.3", "47.2", "521.72", "2388.03", "8125.55", "8.4052", "0.03", "392", "2388", "100.0", "38.86",
                                "23.3735", "0.0", "0.0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"]
            # The form of this is defined in backendController class

            returnVal = getMultiClassPredictorForValues(sensorValues)
            return str(returnVal)


if __name__ == "__main__":
    app.run(debug=True)
