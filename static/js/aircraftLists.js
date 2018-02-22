/*add all the database aircrafts to lists and add listeners to both lists */
function onStartFillLists(aircraftList) {
    addAircraftItems(aircraftList);
    addListenersToDropdownItems();
    addListenersToListItems();
    addSelfRemoveListener();
}

/*fills the lists with the list of aircrafts already in the database on web page open*/
function addAircraftItems(data) {
    for (i = 0; i < data.length; i++) {
         addNewAircraftItems(data[i]);
    }
}

/* adds event listener on the list of Aircrafts panel so it handles dynamically added items*/
function addListenersToListItems() {
	var dropmenu = document.getElementById('itemlist');
	dropmenu.addEventListener("click", function (e) {
		if (e.target && e.target.matches("li.highlight-on-hover")) {
			graphTabShow();
            document.getElementById("tab2").checked = true;
            event.preventDefault();
            cache={}
            var argument = "?engine=" + e.target.innerHTML.split(' ')[1];
            httpGetAsync("/newEngineRequested", alert, argument);
        }
    });
}

/* adds event listener on the dropdown of Graphs panel so it handles dynamically added items*/
function addListenersToDropdownItems() {
	var dropmenu = document.getElementById('dropDownList');
	dropmenu.addEventListener("click", function (e) {
		if (e.target && e.target.matches("li.highlight-on-hover")) {
			event.preventDefault();
            cache ={}
            var argument = "?engine=" + e.target.innerHTML.split(' ')[1];
            httpGetAsync("/newEngineRequested", alert, argument);
        }
    });
}

/*takes an aircraft id and adds it to the list and dropdown- after new testing data is uploaded and predictions computed */
function addNewAircraftItems(newAircraft) {
    document.getElementById('dropDownList').innerHTML += "<li class = \"highlight-on-hover\">" + newAircraft + "</li>";
    document.getElementById('itemlist').innerHTML += "<li class = \"highlight-on-hover\">"+  newAircraft + "</li>";
}
