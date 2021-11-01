function show_entity(event) {
    var host = 'http://localhost:8000/';

    graph_address = host + $(event.target).next('span').text();
    document_name = $(event.target).closest('tr').find('td.doc_name').text();
    // alert(document_name);
    form_class = 'graph_viewer';
    form_id = $(event.target).closest('table').attr('id');
    form_selector = 'form#'.concat(form_id);
    source_address = get_node_info_field(form_id, 'source_address');
    source_collection = get_node_info_field(form_id, 'source_collection');

    url = host + APIs[form_class].url;

    let formData = new FormData();
    formData.append('from', graph_address);
    $('#graph-container').empty();
    $('#graph-container').append('<iframe src="' + graph_address + '"> <iframe>')
    $('#modal-button').click();
    source_address = get_node_info_field(form_id, 'source_address');
    $('#exampleModalLabel').text(source_collection);



}