$('#level').change(function() {
    //do stuff here, eg.
    form_id = $(this).closest('form').attr('id');

    graph_type_label_selector = 'form#' + form_id + ' label#graph_type_label';
    graph_type_selector = 'form#' + form_id + ' select#graph_type';

    min_sim_label_selector = 'form#' + form_id + ' label#min_sim_label';
    min_sim_selector = 'form#' + form_id + ' select#min_sim';

    if ($(this).val() == 'document') { //check the selected option etc.

        $(graph_type_label_selector).removeClass('d-none');
        $(graph_type_selector).removeClass('d-none');
        $(min_sim_label_selector).removeClass('d-none');
        $(min_sim_selector).removeClass('d-none');
    } else {
        $(graph_type_label_selector).addClass('d-none');
        $(graph_type_selector).addClass('d-none');
        $(min_sim_label_selector).addClass('d-none');
        $(min_sim_selector).addClass('d-none');
    }
});