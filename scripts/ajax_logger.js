$(document).ready(function() {

    $(document).ajaxStart(function() {
        console.log('ajax start.');
        // blockUI code with custom message
        $.blockUI({

            // blockUI code with custom 
            // message and styling
            message: "<div class='loader'></div>",
            css: {
                color: 'green',
                borderColor: 'green',
                border: 0
            }
        });
        console.log(' block');
    });

    $(document).ajaxStop(function() {
        console.log('ajax stop.');
    });
    $(document).ajaxSend(function() {
        console.log('ajax send.');
    });
    $(document).ajaxSuccess(function() {
        console.log('ajax succss.');
    });
    $(document).ajaxComplete(function(event, request, settings) {
        // debugger;
        console.log('ajax complete.');
        $.unblockUI();
        console.log(' Unblock');

    });
    $(document).ajaxError(function(event, request, settings) {
        // debugger;
        console.log('ajax error.');

    });
});