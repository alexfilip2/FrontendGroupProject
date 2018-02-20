//Performs cache clearing methods to cause the data for the graphs to be read from the server
var cache = {};
clearCache();

function clearCache() {
    cache = {};
    var timeoutPeriodInMins = 10;
    setTimeout(clearCache, 1000 * 60 * timeoutPeriodInMins);
}

/*sends a async GET to the server on some url, with some arguments
 *and applying the callback function on the server's response content
 */
function httpGetAsync(theUrl, callback, argument) {
    // var url = BASE_URL + theUrl + "?" + argument;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl + argument, true); // true for asynchronous
    xmlHttp.send(null);
}

function getJSONFromBackend(path, functions, argument, cachetype) {
    url = BASE_URL + path;
    xhr = new XMLHttpRequest();
    xhr.open("GET", url + argument, true);

    xhr.onreadystatechange = function () {
        if (xhr.status == 200) {
            if (!xhr.response) return;
            cache[cachetype] = JSON.parse(xhr.response);
            functions(cache[cachetype]);
        }
    };
    xhr.send(null);
}

function sendCSVToBackend() {
    var fileSelect = document.getElementById("file-select");
    var myFormData = new FormData();
    myFormData.append('thefile', fileSelect.files[0]);

    $.ajax({
        url: '/send',
        type: 'POST',
        processData: false,
        contentType: false,
        dataType: 'json',
        data: myFormData,
        success: [function (data){
            handleResponsePredictions(data);
        }]
    });
}

function handleResponsePredictions(data){
    addNewAircraftItems(data);
    alert("New aircraft just added: " + data);
}