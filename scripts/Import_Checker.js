$(function() {

    // This code will attach `fileselect` event to all file inputs on the page
    $(document).on('change', ':file', function() {
        var input = $(this),
            numFiles = input.get(0).files ? input.get(0).files.length : 1,
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileselect', [numFiles, label]);
    });


    $(document).ready(function() {
        //below code executes on file input change and append name in text control
        $(':file').on('fileselect', function(event, numFiles, label) {

            var input = $(this).parents('.input-group').find(':text'),
                log = numFiles > 1 ? numFiles + ' files selected' : label;

            form_id = $(this).closest('form').attr('id');
            // alert(form_id);

            source_collection_selector = '#' + form_id.concat(' .meta-data p.source_collection');

            if (input.length) {
                input.val(log);
                // $(source_collection_selector).text(input.val());
                // input.addClass('btn-outline-success')
            } else {
                if (log) alert(log);
            }

        });
    });

    $(".FilUploader").change(function() {
        form_id = $(this).closest('form').attr('id');
        // alert(form_id);
        text_input_selector = '#' + form_id.concat(' #text-input');
        file_btn_selector = '#' + form_id.concat(' #file-btn');
        source_collection_selector = '#' + form_id.concat(' .source_collection');
        state_selector = '#' + form_id.concat(' .state');
        tip_selector = '#' + form_id.concat(' .tip');

        var fileExtension = ['zip', 'rar', '7z'];
        if ($.inArray($(this).val().split('.').pop().toLowerCase(), fileExtension) == -1) {
            alert("Only formats are allowed : " + fileExtension.join(', '));
            $(this).val(null);
            $(text_input_selector).removeClass('border-info');
            $(text_input_selector).addClass('border-danger');
            $(file_btn_selector).addClass('btn-outline-danger');
            $(state_selector).text('Created');
            $(tip_selector).text('Select a zip file.');



        } else {
            text_color = 'text-info';
            border_color = 'border-info';


            $(text_input_selector).removeClass('border-info');
            $(text_input_selector).removeClass('border-danger');
            $(text_input_selector).addClass('border-success');
            $(file_btn_selector).removeClass('btn-outline-info');
            $(file_btn_selector).removeClass('btn-outline-danger');
            $(file_btn_selector).addClass('btn-outline-success');
            $(state_selector).text('Ready');
            $(state_selector).removeClass("text-success text-info' text-warning text-danger text-secondary");
            $(state_selector).addClass(text_color);
            $(tip_selector).text('');


            controll_selector = 'div.control#'.concat(form_id);
            icon_selector = controll_selector.concat(' i');

            $(controll_selector).removeClass("text-success text-info' text-warning text-danger text-secondary");
            $(controll_selector).addClass(text_color);

            $(icon_selector).removeClass("text-success text-info' text-warning text-danger text-secondary");
            $(icon_selector).addClass(text_color);

            $(controll_selector).removeClass("border-success border-info border-warning border-danger border-secondary");
            $(controll_selector).addClass(border_color);
            // $(source_collection_selector).text($(text_input_selector).val());
        }
    });

});