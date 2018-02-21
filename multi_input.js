function addTagElement() {
    var content = document.getElementById('textBoxTags').value;
    document.getElementById("tagList").innerHTML += "<li class = \"multi_input_tagElem\" ng-repeat=\"skill in skills\">\n" +
        "      <span class=\"fa fa-close\"   ></span>\n" +
        "      <span>" + content + "</span>\n" +
        "    </li>"
}

function addSelfRemoveListener() {
    var multi_list = document.getElementById('tagList');
    multi_list.addEventListener("click", function (e) {
        if (e.target && e.target.matches("span.fa-close")) {
            event.preventDefault();
            e.target.parentElement.remove();

        }
    });


}