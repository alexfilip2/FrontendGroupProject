import urllib.request
import json
import csv

############
# TODO this will need rewriting to update when the server changes so that it passes it 4 values
############
url3a = 'https://europewest.services.azureml.net/workspaces/007b0d03320845ccb46681a9b36a2a90/services/dae44509e8974e23bdeebe3e4df72380/execute?api-version=2.0&details=true'
api_key3a = 'dc/2D4A866/zjc/Hio+lu+lk441UgUDc0xgsdN3e07WpmkOFQbEhQSpJ3IDV3eq/QXkvy2iIRkii+8wCBz+LvA=='
headers3a = {'Content-Type':'application/json', 'Authorization':('Bearer '+ api_key3a)}

url3c = 'https://europewest.services.azureml.net/workspaces/007b0d03320845ccb46681a9b36a2a90/services/ab53de31a7f94c5aa7383230c1d95483/execute?api-version=2.0&details=true'
api_key3c = 'cAmIZyceyWVTsdW/OUqRUXfCRu1MtUqx9ZqWhk32wrxkGgMHQSoeAyCQ5xxG5WDANcJYu8z+DyesFkHGXzUXAw=='
headers3c = {'Content-Type':'application/json', 'Authorization':('Bearer '+ api_key3c)}

def getMultiClassPredictorForCSVdata(data):
    readerObject = csv.reader(data, delimiter=' ')
    dataArray =[x for x in readerObject]
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
                    "ColumnNames": ["cycle", "setting1", "setting2", "setting3", "s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12", "s13", "s14", "s15", "s16", "s17", "s18", "s19", "s20", "s21", "s22", "s23"],
                    "Values": arrayOfValues
                }, },
        "GlobalParameters": {
        }
    }
    return object

def makeMultiClassRequestForData(data):
    body = str.encode(json.dumps(data))
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
