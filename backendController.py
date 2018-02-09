import urllib.request
import json
############
# TODO this will need rewriting to update when the server changes so that it passes it 4 values
############
url3a = 'https://europewest.services.azureml.net/workspaces/007b0d03320845ccb46681a9b36a2a90/services/dae44509e8974e23bdeebe3e4df72380/execute?api-version=2.0&details=true'
api_key3a = 'dc/2D4A866/zjc/Hio+lu+lk441UgUDc0xgsdN3e07WpmkOFQbEhQSpJ3IDV3eq/QXkvy2iIRkii+8wCBz+LvA=='
headers3a = {'Content-Type':'application/json', 'Authorization':('Bearer '+ api_key3a)}

url3c = 'https://europewest.services.azureml.net/workspaces/007b0d03320845ccb46681a9b36a2a90/services/ab53de31a7f94c5aa7383230c1d95483/execute?api-version=2.0&details=true'
api_key3c = 'cAmIZyceyWVTsdW/OUqRUXfCRu1MtUqx9ZqWhk32wrxkGgMHQSoeAyCQ5xxG5WDANcJYu8z+DyesFkHGXzUXAw=='
headers3c = {'Content-Type':'application/json', 'Authorization':('Bearer '+ api_key3c)}


def getMultiClassPredictorForValues(arrayOfValues):
    dataObject = getDataObjectForValues(arrayOfValues)
    response = makeMultiClassRequestForData(dataObject)
    return getValueArrayFromResponse(response)


def getDataObjectForValues(arrayOfValues):
    object = {
        "Inputs": {

            "input1":
                {
                    "ColumnNames": ["cycle", "setting1", "setting2", "setting3", "s1", "s2", "s3", "s4", "s5", "s6",
                                    "s7", "s8", "s9", "s10", "s11", "s12", "s13", "s14", "s15", "s16", "s17", "s18",
                                    "s19", "s20", "s21", "s22", "s23", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8",
                                    "a9", "a10", "a11", "a12", "a13", "a14", "a15", "a16", "a17", "a18", "a19", "a20",
                                    "a21", "a22", "a23", "sd1", "sd2", "sd3", "sd4", "sd5", "sd6", "sd7", "sd8", "sd9",
                                    "sd10", "sd11", "sd12", "sd13", "sd14", "sd15", "sd16", "sd17", "sd18", "sd19",
                                    "sd20", "sd21", "sd22", "sd23"],
                    "Values": [arrayOfValues]
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
