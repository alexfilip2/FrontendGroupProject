import urllib.request
import urllib
import json
import pyodbc
import csv
import numpy


### Database tables names ###
HISTORICAL_DATATABLE = "plane_data"
FAILURE_DATATABLE = "failure_probability"
RUL_DATATABLE = "rul"

### Model API url and headers ###
url3a = 'https://europewest.services.azureml.net/workspaces/007b0d03320845ccb46681a9b36a2a90/services/8ff2c315926a4cd58d6b2aee4105e836/execute?api-version=2.0&details=true'
api_key3a = 'iesWvACrhJUYrNT1sa/ua5YdaUx8MpPUlmPoQrodJJzWxcGrSUor2nKlGNMjlLmE8pBpEJn3cRXrf2fxHg0eJA==' # Replace this with the API key for the web service
headers3a = {'Content-Type':'application/json', 'Authorization':('Bearer '+ api_key3a)}

url3c = 'https://europewest.services.azureml.net/workspaces/007b0d03320845ccb46681a9b36a2a90/services/ab53de31a7f94c5aa7383230c1d95483/execute?api-version=2.0&details=true'
api_key3c = 'cAmIZyceyWVTsdW/OUqRUXfCRu1MtUqx9ZqWhk32wrxkGgMHQSoeAyCQ5xxG5WDANcJYu8z+DyesFkHGXzUXAw=='
headers3c = {'Content-Type':'application/json', 'Authorization':('Bearer '+ api_key3c)}
    
### SQL Connection data ###
SQL_server = 'pm-aerospace.database.windows.net'
SQL_database = 'PredictiveMaintenanceDB'
SQL_username = 'ServerAdmin@pm-aerospace'
SQL_password = '73WhVmRRm'
SQL_driver= '{ODBC Driver 13 for SQL Server}'
SQL_connection_text = 'DRIVER='+SQL_driver+';PORT=1433;SERVER='+SQL_server+';PORT=1443;DATABASE='+SQL_database+';UID='+SQL_username+';PWD='+SQL_password

### Display Variables ###
DISPLAY_LIMIT = 10

def activateModel(url, headers):
    ### Call the model api to initialise the predications process (return when the predictions are saved into the database)
    data =  { "GlobalParameters": {  }  } 
    body = str.encode(json.dumps(data))
    req = urllib.request.Request(url, body, headers) 
    response = urllib.request.urlopen(req)
    #print(response.read())
    return

    
def updateDatabaseWithCSV(filename):
    ### Given a filepath, parse the file and upload the data into the HISTORICAL_DATATABLE
    cnxn = pyodbc.connect(SQL_connection_text)
    cursor = cnxn.cursor()     
    with open(filename) as csvfile:
        reader = csv.reader(csvfile)
        dataArray = []
        for row in reader:
            datarow = row[0].split(' ')
            if (len(datarow) != 28): raise Exception("Missing Data in columns")
            dataArray.append(datarow)
        #if uploaded data is empty
        if (len(dataArray) == 0): return 
        #convert to float
        dataArray = list(map(lambda x : list(map(float, x)), dataArray))
        sqlquery = ""
        for r in list(map(lambda r: "id = %s AND cycle = %s" % (str(int(r[0])), str(int(r[1]))),dataArray)):
            sqlquery += r + " OR "
        sqlquery = sqlquery[:-4]
        
        cursor.execute("DELETE FROM %s WHERE %s" % (HISTORICAL_DATATABLE, sqlquery))
        cursor.execute("DELETE FROM %s WHERE %s" % (FAILURE_DATATABLE, sqlquery))
        cursor.execute("DELETE FROM %s WHERE %s" % (RUL_DATATABLE, sqlquery))
        for row in dataArray:
            cursor.execute("INSERT INTO %s VALUES (%s)" % (HISTORICAL_DATATABLE, str(row)[1:-1]))
        cursor.commit()
        
        activateModel(url3a, headers3a)
        activateModel(url3c, headers3c)
    return
#updateDatabaseWithCSV("D:\\Users\\Kuro\\Downloads\\Single_Engine_Test_Data.csv")
    
def getAircraftList():
    cnxn = pyodbc.connect(SQL_connection_text)
    cursor = cnxn.cursor()
    lst = []
    cursor.execute("SELECT DISTINCT ID FROM %s ORDER BY ID" % (HISTORICAL_DATATABLE))
    for row in cursor.fetchall():
        lst.append("Aircraft "+str(row[0]))
    return lst

def getRiskGraphData(fleet = []):
    ### if no fleet is provided, return the DISPLAY_LIMIT number of aircrafts ordered by id
    cnxn = pyodbc.connect(SQL_connection_text)
    cursor = cnxn.cursor()
    aircraftLst = []
    workingData = []
    remainingData = []
    ids = "WHERE"
    for id in fleet:
        ids += " id = %s OR" % (id)
    cursor.execute("SELECT * FROM %s JOIN (SELECT id AS mid, MAX(cycle) AS c FROM %s %s GROUP BY id) Q ON id = mid WHERE c = cycle ORDER BY ID; " % (RUL_DATATABLE, RUL_DATATABLE, ids[:-2]))
    for row in cursor.fetchmany(DISPLAY_LIMIT if fleet == [] else min(DISPLAY_LIMIT, len(fleet))):
        aircraftLst.append(float(row[0]))
        workingData.append(float(row[1]))
        remainingData.append(float(row[2]))
    riskgraph = []
    for i in range(min(DISPLAY_LIMIT, len(aircraftLst))):
        riskgraph.append({"category" : aircraftLst[i], 
                          "segments": [{"start": 0, "duration" : workingData[i], "color": "#46615e", "task": "Working"},
                                       {"duration": remainingData[i], "color": "#727d6f", "task": "Predicted"}]})
    return riskgraph
    
def getLifeDistHistogram(fleet = []):
    ### if no fleet is provided, return the DISPLAY_LIMIT number of aircrafts ordered by id
    cnxn = pyodbc.connect(SQL_connection_text)
    cursor = cnxn.cursor()
    workingData = []
    remainingData = []
    ids = "WHERE"
    for id in fleet:
        ids += " id = %s OR" % (id)
    cursor.execute("SELECT * FROM %s JOIN (SELECT id AS mid, MAX(cycle) AS c FROM %s %s GROUP BY id) Q ON id = mid WHERE c = cycle ORDER BY ID; " % (RUL_DATATABLE, RUL_DATATABLE, ids[:-2]))
    for row in cursor.fetchmany(DISPLAY_LIMIT if fleet == [] else min(DISPLAY_LIMIT, len(fleet))):
        workingData.append(float(row[1]))
        remainingData.append(float(row[2]))
    print(workingData)
    histogram = [{"name" : "Working", "data" : workingData},
                 {"name" : "Predicted until failure", "data" : remainingData}, 
                 {"name" : "Total", "data" : [x + y for x, y in zip(workingData, remainingData)]}]
    return histogram
   
def getDustExposureData(aircraftID):
    cnxn = pyodbc.connect(SQL_connection_text)
    cursor = cnxn.cursor()
    cursor.execute("SELECT * FROM %s WHERE ID = %s" % (HISTORICAL_DATATABLE, str(aircraftID)))
    data = []
    for row in cursor.fetchall():
        data.append([str(row[1]), str(row[26])])
    return data
    
def getAccumulatedDustData(aircraftID):
    cnxn = pyodbc.connect(SQL_connection_text)
    cursor = cnxn.cursor()
    cursor.execute("SELECT * FROM %s WHERE ID = %s" % (HISTORICAL_DATATABLE, str(aircraftID)))
    data = []
    for row in cursor.fetchall():
        data.append([str(row[1]), str(row[27])])
    return data

def getRULs(aircraftID):
    cnxn = pyodbc.connect(SQL_connection_text)
    cursor = cnxn.cursor()
    cursor.execute("SELECT cycle,RUL FROM rul WHERE id = "+str(aircraftID)+" ORDER BY cycle;")
    x = []
    y = []
    for row in cursor.fetchall():
        x.append(row[0])
        y.append(row[1])
    c = numpy.polyfit(x,y,1)

    maxerr = max([abs((c[0]*a + c[1]) - b) for a,b in zip(x,y)])

    ret = [[a, round(c[0]*a+c[1]-maxerr,2), round(c[0]*a+c[1]+maxerr,2), b] for a,b in zip(x,y)]
  
    return ret
    
def getSimpleRULs(aircraftID):
    cnxn = pyodbc.connect(SQL_connection_text)
    cursor = cnxn.cursor()
    cursor.execute("SELECT cycle,RUL FROM rul WHERE id = "+str(aircraftID)+" ORDER BY cycle;")
    return [[x,y] for x,y in cursor.fetchall()]

def getFailureProbs(aircraftID):
    cnxn = pyodbc.connect(SQL_connection_text)
    cursor = cnxn.cursor()
    cursor.execute("SELECT * FROM failure_probability WHERE id="+str(aircraftID)+";")
    row = cursor.fetchone()
    predictions = row[2:]
    return [[x*10,y*100] for x,y in zip(range(0,100),predictions)]

def getMultiClassPredictorForCSVdata(data):
    dataRows = data.split('\n')
    dataRows = dataRows[:-1]
    dataArray = []
    for i in range(0, len(dataRows)):
        dataArray.append(dataRows[i].split(' '))
    return getMultiClassPredictorForValues(dataArray)

def csvTest():
    with open('/Users/james_hargreaves/Desktop/engine_data/singlePlaneData.csv', 'rt', encoding='utf8') as csvfile:
        print(getMultiClassPredictorForCSVdata(csvfile))


def getMultiClassPredictorForValues(arrayOfValues):
    dataObject = getDataObjectForValues(arrayOfValues)
    response = makeMultiClassRequestForData(dataObject)
    return getIntResultsFromStringList(getValueArrayFromResponse(response))


def getDataObjectForValues(arrayOfValues):
    object = {
        "Inputs": {
            "input1":
                {
                    "ColumnNames": ["id", "cycle", "setting1", "setting2", "setting3", "s1", "s2", "s3", "s4", "s5",
                                    "s6", "s7", "s8", "s9", "s10", "s11", "s12", "s13", "s14", "s15", "s16", "s17",
                                    "s18", "s19", "s20", "s21", "s22", "s23"],
                    "Values": arrayOfValues
                }, },
        "GlobalParameters": {
        }
    }
    return object

def makeMultiClassRequestForData(data):
    body = str.encode(json.dumps(data))
    # try:
    #     req = urllib.request.Request(url3c, body, headers3c)
    #     response = urllib.request.urlopen(req)
    #     return response
    # except urllib.error.HTTPError as err:
    #     print(err)
    #     return ""
    #
    req = urllib.request.Request(url3c, body, headers3c)
    response = urllib.request.urlopen(req)
    return response


def getValueArrayFromResponse(response):
    respData = response.read().decode('utf-8')
    respJson = json.loads(respData)
    valuesArray = respJson["Results"]["output1"]["value"]["Values"][0]
    return valuesArray

def getIntResultsFromStringList(strList):
    intList = list(map(float, strList))
    return intList
