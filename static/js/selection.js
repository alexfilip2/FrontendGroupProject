var once = true;
var fieldId = 1;

 /* the button that produces the default field and the submit button
 * when pressed the second time should only collapse the panel
 * that's why the "once" variable
 */

function showCalendarOnce() {
    if (!once) return;
    once = false;
    document.getElementById('newContent').innerHTML += "<!DOCTYPE html>\n" +
          "<html lang=\"en\">\n" +
          "\n" +
          "<head>\n" +
          "  <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\n" +
          "  <meta charset=\"utf-8\">\n" +
          "  <title>FormDen Example</title>\n" +
          "</head>\n" +
          "<body>\n" +
          "<!-- Inline CSS based on choices in \"Settings\" tab -->\n" +
          "<style>.bootstrap-iso .formden_header h2, .bootstrap-iso .formden_header p, .bootstrap-iso form{font-family: Arial, Helvetica, sans-serif; color: black}.bootstrap-iso form button, .bootstrap-iso form button:hover{color: white !important;} .asteriskField{color: red;}</style>\n" +
          "\n" +
          "<!-- HTML Form (wrapped in a .bootstrap-iso div) -->\n" +
          "<div class=\"bootstrap-iso\">\n" +
          " <div class=\"container-fluid\">\n" +
          "  <div class=\"row\">\n" +
          "   <div class=\"col-md-6 col-sm-6 col-xs-12\">\n" +
          "    <form  class=\"form-horizontal\"  >\n" +
          "\t<h3  style = \" clear: left; display: block;\"> Introduce date </h3>\n" +
          "     <div class=\"form-group\"  style = \" clear: left;display: block;\">\n" +
          "       <div class=\"col-sm-10\">\n" +
          "       <div class=\"input-group\">\n" +
          "        <div class=\"input-group-addon\">\n" +
          "         <i class=\"fa fa-calendar\">\n" +
          "         </i>\n" +
          "        </div>\n" +
          "        <input id='field" + fieldId +"' name='field"+fieldId+"' class=\"form-control\"  placeholder=\"MM/DD/YYYY\" type=\"text\"/>\n" +
          "       </div>\n" +
          "      </div>\n" +
          "     </div>\n" +
          "\t <div id = \"newInputDate\"> </div>\n" +
          "     <div class=\"form-group\">\n" +
          "      <div class=\"col-sm-10 col-sm-offset-2\">      \n" +
          "       <button class=\"btn btn-primary  name=\"submit\" type=\"reset\" onclick =\"getAllDates();\">\n" +
          "        Submit\n" +
          "       </button>\n" +
          "      </div>\n" +
          "     </div>\n" +
          "    </form>\n" +
          "   </div>\n" +
          "  </div>\n" +
          " </div>\n" +
          "</div>\n" +
          "</body>\n" +
          "</html> ";

     showDatePicker();
}
// adds a new filed on the page, there will be still one submit button
function addNewField() {
    fieldId += 1;
    document.getElementById('newInputDate').innerHTML += "\t<h3 id ='introDate" + fieldId + "' style = \" clear: left; display: block;\"> Introduce date </h3>\n" +
        "     <div class=\"form-group\" id = 'formDate" + fieldId + "' style = \" clear: left;display: block; background-color: #e6e6e6;\">\n" +
        "       <div class=\"col-sm-10\">\n" +
        "       <div class=\"input-group\">\n" +
        "        <div class=\"input-group-addon\">\n" +
        "         <i class=\"fa fa-calendar\">\n" +
        "         </i>\n" +
        "        </div>\n" +
        "        <input id='field" + fieldId +"' name='field"+fieldId+"'  class=\"form-control\"  placeholder=\"MM/DD/YYYY\" type=\"text\"/>\n" +
        "       </div>\n" +
        "      </div>\n" +
        "     </div>\n";
    showDatePicker();
}

function getDateInput() {
    for (i = 1; i <= fieldId; i++) {
        var input = document.getElementById("field" + i).value;
        alert(input);
    }
}

function removeLastField() {
    if (fieldId == 1) return;
    var form = document.getElementById("formDate" + fieldId);
    var intro_text = document.getElementById("introDate" + fieldId);
    form.outerHTML = "";
    intro_text.outerHTML = "";
    delete form;
    delete intro;
    fieldId -= 1;
}