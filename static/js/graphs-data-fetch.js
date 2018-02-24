/*sends a async GET to the server on some url, with some arguments
 *and applying the callback function on the server's response content
 */
function getJSONFromBackend(path, functions, argument, cachetype) {
    url = path;
    xhr = new XMLHttpRequest();
    xhr.open("POST", url + argument, true);

    xhr.onreadystatechange = function () {
        if (xhr.status == 200) {
            if (!xhr.response) return;
            cache[cachetype] = JSON.parse(xhr.response);
            functions(cache[cachetype]);
        }
    };
    xhr.send(null);
}

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
        success: [function (data) {
            handleResponsePredictions(data);
        }]
    });
}

function asyncPOSTRequest(data, path, callback, name) {
    var myFormData = new FormData();
    myFormData.append(name, data);
    $.ajax({
        url: path,
        type: 'POST',
        processData: false,
        contentType: false,
        dataType: 'json',
        data: myFormData,
        success: [function (response) {
            callback(response);
        }]
    });
}

