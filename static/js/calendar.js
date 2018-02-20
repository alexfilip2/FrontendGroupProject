function showDatePicker() {
    $(document).ready(function () {
        for (i = 1; i <= fieldId; i++) {
            var nameField = "field" + i;
            var date_input = $('input[name=' + nameField + ']'); //our date input has the name "field"+ its number
            var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
            date_input.datepicker({
                format: 'mm/dd/yyyy',
                container: container,
                todayHighlight: true,
                autoclose: true,
            });
        }
    });
}