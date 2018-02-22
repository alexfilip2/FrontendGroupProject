import urllib.request
import urllib
import json
import pyodbc
import csv
import numpy
import threading
from socket import timeout

### Database tables names ###
HISTORICAL_DATATABLE = "plane_data"
FAILURE_DATATABLE = "failure_probability"
RUL_DATATABLE = "rul"

### Model API url and headers ###
url_regression = 'https://europewest.services.azureml.net/workspaces/007b0d03320845ccb46681a9b36a2a90/services/10578fdf792c4382a716c0a406550e7a/execute?api-version=2.0&details=true'
api_key_regression = '+dp1pYmEFBTZNgxzYyhcLcjHYjGpBsaqPxXVtpriQBDPg2PEyS6trkf0BiNDc3Pn+il/JvR5TD6sS/hN4XHYdw=='  # Replace this with the API key for the web service
headers_regression = {'Content-Type': 'application/json', 'Authorization': ('Bearer ' + api_key_regression)}

url_multiclass = 'https://europewest.services.azureml.net/workspaces/007b0d03320845ccb46681a9b36a2a90/services/7414a8ff63ae4673b14c06635d6ce67d/execute?api-version=2.0&details=true'
api_key_multiclass = '87+RaG3Z1gOYEEz0CdKKgBHjzPU3AdHZoknGidMJkR0+ASE5dDBSiDIYsgAT2S74WaW0n/YOsCnys1l05mVOVA=='
headers_multiclass = {'Content-Type': 'application/json', 'Authorization': ('Bearer ' + api_key_multiclass)}

### SQL Connection data ###
SQL_server = 'pm-aerospace.database.windows.net'
SQL_database = 'PredictiveMaintenanceDB'
SQL_username = 'ServerAdmin@pm-aerospace'
SQL_password = '73WhVmRRm'
SQL_driver = '{ODBC Driver 13 for SQL Server}'
SQL_connection_text = 'DRIVER=' + SQL_driver + ';PORT=1433;SERVER=' + SQL_server + ';PORT=1443;DATABASE=' + SQL_database + ';UID=' + SQL_username + ';PWD=' + SQL_password

### Display Variables ###
DISPLAY_LIMIT = 10

def activateModelWorker(url, headers):
    ### Call the model api to initialise the predications process (return when the predictions are saved into the database)
    ### Return 0 if it run successfully and 1 if there is a timeout and 2 for other errors
    data = {"GlobalParameters": {}}
    body = str.encode(json.dumps(data))
    req = urllib.request.Request(url, body, headers)
    try: 
        response = urllib.request.urlopen(req)
    except timeout as e:
        return 1
    except:
        return 2
    #print(response.read())
    return 0
    
def updateDatabaseWithCSV(csvString):
    ### Given a csvString (decoded utf-8), parse the string
    ### remove any duplicate data in the database and upload the data into the HISTORICAL_DATATABLE
    ### raise Exception("Missing Data in Columns") if there are empty data in the columns
    ### Return a list of threads which are calling the model api web service
    csvArray = csvString.split('\n')[:-1]
    dataArray = []
    cnxn = pyodbc.connect(SQL_connection_text)
    cursor = cnxn.cursor()
   
    # check if all the data is present
    for row in csvArray:
        datarow = row[:-1].split(' ')
        if (len(datarow) != 28): raise Exception("Missing Data in Columns")
        dataArray.append(datarow)
    # convert to float
    dataArray = list(map(lambda x: list(map(float, x)), dataArray))
    sqlquery = ""
   
    # remove duplicate data from database
    for r in list(map(lambda r: "id = %s AND cycle = %s" % (str(int(r[0])), str(int(r[1]))), dataArray)):
        sqlquery += r + " OR "
    sqlquery = sqlquery[:-4]
    cursor.execute("DELETE FROM %s WHERE %s" % (HISTORICAL_DATATABLE, sqlquery))
    cursor.execute("DELETE FROM %s WHERE %s" % (FAILURE_DATATABLE, sqlquery))
    cursor.execute("DELETE FROM %s WHERE %s" % (RUL_DATATABLE, sqlquery))

    # add the data into the historical datatable
    for row in dataArray:
        cursor.execute("INSERT INTO %s VALUES (%s)" % (HISTORICAL_DATATABLE, str(row)[1:-1]))
    cursor.commit()
   
    # create threads to call the model API 
    threads = []
    model_api = [(url_regression, headers_regression) , (url_multiclass, headers_multiclass)]
    
    for (url, headers) in model_api:
       t = threading.Thread(target=activateModelWorker, args=(url,headers))
       threads.append(t)
       t.start()  
    return threads


def getAircraftList():
    cnxn = pyodbc.connect(SQL_connection_text)
    cursor = cnxn.cursor()
    lst = []
    cursor.execute("SELECT DISTINCT ID FROM %s ORDER BY ID" % (HISTORICAL_DATATABLE))
    for row in cursor.fetchall():
        lst.append("Aircraft " +str(row[0]))
    return lst


def getRiskGraphData(fleet=[]):
    ### if no fleet is provided, return the DISPLAY_LIMIT number of aircrafts ordered by id
    cnxn = pyodbc.connect(SQL_connection_text)
    cursor = cnxn.cursor()
    aircraftLst = []
    workingData = []
    remainingData = []
    ids = "WHERE"
    for id in fleet:
        ids += " id = %s OR" % (id)
    cursor.execute(
        "SELECT * FROM %s JOIN (SELECT id AS mid, MAX(cycle) AS c FROM %s %s GROUP BY id) Q ON id = mid WHERE c = cycle ORDER BY ID; " % (
        RUL_DATATABLE, RUL_DATATABLE, ids[:-2]))
    for row in cursor.fetchmany(DISPLAY_LIMIT if fleet == [] else min(DISPLAY_LIMIT, len(fleet))):
        aircraftLst.append(float(row[0]))
        workingData.append(float(row[1]))
        remainingData.append(float(row[2]))
    riskgraph = []
    for i in range(min(DISPLAY_LIMIT, len(aircraftLst))):
        riskgraph.append({"category": aircraftLst[i],
                          "segments": [{"start": 0, "duration": workingData[i], "color": "#46615e", "task": "Working"},
                                       {"duration": remainingData[i], "color": "#727d6f", "task": "Predicted"}]})
    return riskgraph


def getLifeDistHistogram(fleet=[]):
    ### if no fleet is provided, return the DISPLAY_LIMIT number of aircrafts ordered by id
    cnxn = pyodbc.connect(SQL_connection_text)
    cursor = cnxn.cursor()
    workingData = []
    remainingData = []
    ids = "WHERE"
    for id in fleet:
        ids += " id = %s OR" % (id)
    cursor.execute(
        "SELECT * FROM %s JOIN (SELECT id AS mid, MAX(cycle) AS c FROM %s %s GROUP BY id) Q ON id = mid WHERE c = cycle ORDER BY ID; " % (
        RUL_DATATABLE, RUL_DATATABLE, ids[:-2]))
    for row in cursor.fetchmany(DISPLAY_LIMIT if fleet == [] else min(DISPLAY_LIMIT, len(fleet))):
        workingData.append(float(row[1]))
        remainingData.append(float(row[2]))
    print(workingData)
    histogram = [{"name": "Working", "data": workingData},
                 {"name": "Predicted until failure", "data": remainingData},
                 {"name": "Total", "data": [x + y for x, y in zip(workingData, remainingData)]}]
    return histogram


def getDustExposureData(aircraftID):
    cnxn = pyodbc.connect(SQL_connection_text)
    cursor = cnxn.cursor()
    cursor.execute("SELECT * FROM %s WHERE ID = %s" % (HISTORICAL_DATATABLE, str(aircraftID)))
    data = []
    for row in cursor.fetchall():
        data.append([row[1],row[26]*10])
    return data


def getAccumulatedDustData(aircraftID):
    cnxn = pyodbc.connect(SQL_connection_text)
    cursor = cnxn.cursor()
    cursor.execute("SELECT * FROM %s WHERE ID = %s" % (HISTORICAL_DATATABLE, str(aircraftID)))
    data = []
    for row in cursor.fetchall():
        data.append([row[1],row[27]*10])
    return data


def getRULs(aircraftID):
    cnxn = pyodbc.connect(SQL_connection_text)
    cursor = cnxn.cursor()
    cursor.execute("SELECT cycle,RUL FROM rul WHERE id = " + str(aircraftID) + " ORDER BY cycle;")
    x = []
    y = []
    for row in cursor.fetchall():
        x.append(row[0])
        y.append(row[1])
    c = numpy.polyfit(x, y, 1)

    maxerr = max([abs((c[0] * a + c[1]) - b) for a, b in zip(x, y)])

    ret = [[a, round(c[0] * a + c[1] - maxerr, 2), round(c[0] * a + c[1] + maxerr, 2), b] for a, b in zip(x, y)]

    return ret

def getSimpleRULs(aircraftID):
    cnxn = pyodbc.connect(SQL_connection_text)
    cursor = cnxn.cursor()
    cursor.execute("SELECT cycle,RUL FROM rul WHERE id = "+str(aircraftID)+" ORDER BY cycle;")
    return [[x,y] for x,y in cursor.fetchall()]


def getFailureProbs(aircraftID):
    cnxn = pyodbc.connect(SQL_connection_text)
    cursor = cnxn.cursor()
    cursor.execute("SELECT * FROM failure_probability WHERE id=" + str(aircraftID) + ";")
    row = cursor.fetchone()
    predictions = row[2:]
    return [0,0] + [[(x+1) * 10, y * 100] for x, y in zip(range(0, 100), predictions)]
    