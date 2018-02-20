import urllib.request
import urllib
import json
import pyodbc
import csv

HISTORICAL_DATATABLE = "plane_data"
FAILURE_DATATABLE = "failure_probability"
RUL_DATATABLE = "rul"

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
    
def activateModel(url, headers):
    data =  { "GlobalParameters": {  }  } 
    body = str.encode(json.dumps(data))
    req = urllib.request.Request(url, body, headers) 
    response = urllib.request.urlopen(req)
    print(response.read())
    return

	
def getDustData(engineId):
    cnxn = pyodbc.connect(SQL_connection_text)
    cursor = cnxn.cursor()
    cursor.execute("SELECT * FROM %s WHERE ID = %s" % (HISTORICAL_DATATABLE, str(engineId)))
    row = cursor.fetchone()	
    while row:
        print (str(row[26]) + " " + str(row[27]))
        row = cursor.fetchone()
        
	
def updateDatabaseWithCSV(filename):
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
		
        for row in dataArray:
            cursor.execute("INSERT INTO %s VALUES (%s)" % (HISTORICAL_DATATABLE, str(row)[1:-1]))
        cursor.commit()
    return

#updateDatabaseWithCSV("D:\\Users\\Kuro\\Downloads\\Single_Engine_Test_Data.csv")
    
def getFailureProbs(aircraftID):
    cnxn = pyodbc.connect(SQL_connection_text)
    cursor = cnxn.cursor()
    cursor.execute("SELECT * from  where id = "+aircraftID)
    row = cursor.fetchone()
    while row:
        print (str(row[0]) + " " + str(row[1]))
        row = cursor.fetchone()

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
