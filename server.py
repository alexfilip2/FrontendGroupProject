import   os
import csv

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
    return render_template('main_screen.html')




@app.route('/dataGraph', methods=['GET', 'POST'])
def upload_file():

        if request.method == 'GET':
            print("da")

            return  jsonify(graph_data)


if __name__ == "__main__":
    app.run(debug=True)
