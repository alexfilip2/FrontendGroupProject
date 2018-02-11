
var once =0;
var fieldId =1;

function newContent() {
    if (once == 0)
        showCalendarOnce();
}

function showCalendarOnce() {

    once =1;
     document.getElementById('newContent').innerHTML+= "<!DOCTYPE html>\n" +
          "<html lang=\"en\">\n" +
          "\n" +
          "<head>\n" +
          "  <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\n" +
          "  <meta charset=\"utf-8\">\n" +
          "  <title>FormDen Example</title>\n" +
          "</head>\n" +
          "<body>\n" +
          " \n" +
          "\n" +
          "<!-- Special version of Bootstrap that is isolated to content wrapped in .bootstrap-iso -->\n" +
          "<link rel=\"stylesheet\" href=\"https://formden.com/static/cdn/bootstrap-iso.css\" />\n" +
          "\n" +
          "<!--Font Awesome (added because you use icons in your prepend/append)-->\n" +
          "<link rel=\"stylesheet\" href=\"https://formden.com/static/cdn/font-awesome/4.4.0/css/font-awesome.min.css\" />\n" +
          "\n" +
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
          "        <input id='field" + fieldId +"' class=\"form-control\"  placeholder=\"MM/DD/YYYY\" type=\"text\"/>\n" +
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
          "\n" +
          "\n" +
          "<!-- Extra JavaScript/CSS added manually in \"Settings\" tab -->\n" +
          "<!-- Include jQuery -->\n" +
          "<script type=\"text/javascript\" src=\"https://code.jquery.com/jquery-1.11.3.min.js\"></script>\n" +
          "\n" +
          "<!-- Include Date Range Picker -->\n" +
          "<script type=\"text/javascript\" src=\"https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.4.1/js/bootstrap-datepicker.min.js\"></script>\n" +
          "<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.4.1/css/bootstrap-datepicker3.css\"/>\n" +
          "\n" +
          "\n" +
          "</body>\n" +
          "\n" +
          "</html> ";

    }
    function addContent() {
    fieldId+=1;

    document.getElementById('newInputDate').innerHTML+=   "\t<h3 id ='introDate"+fieldId+"' style = \" clear: left; display: block;\"> Introduce date </h3>\n" +
          "     <div class=\"form-group\" id = 'formDate" + fieldId+"' style = \" clear: left;display: block;\">\n" +
          "       <div class=\"col-sm-10\">\n" +
          "       <div class=\"input-group\">\n" +
          "        <div class=\"input-group-addon\">\n" +
          "         <i class=\"fa fa-calendar\">\n" +
          "         </i>\n" +
          "        </div>\n" +
          "        <input id='field" + fieldId +"' class=\"form-control\"  placeholder=\"MM/DD/YYYY\" type=\"text\"/>\n" +
          "       </div>\n" +
          "      </div>\n" +
          "     </div>\n"  ;
        
    }
    function getAllDates() {

    for(i=1;i<=fieldId;i++) {
        var input = document.getElementById("field"+i).value;
        alert(input);
    }

    }
    function removeLastField() {
    if (fieldId==1) return;
    var form = document.getElementById("formDate"+fieldId);
    var intro = document.getElementById("introDate"+fieldId);
    form.outerHTML = "";
    intro.outerHTML = "";
    delete form;
    delete intro;

    fieldId-=1;

    }