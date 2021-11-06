function show_graph(event) {
    graph_address = $(event.target).next('span').text();
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

    // alert($('#FilUploader')[0].files[0]);
    $.ajax({
        //  url: "https://localhost:8000/api/export/",
        url: host + graph_viewer_api.url,
        data: formData,
        type: 'POST',
        contentType: false,
        processData: false,
    }).done(function(res) {

        anychart.onDocumentReady(function() {
            // alert('data');
            $('#graph-container').empty();
            // create data
            var data = res;
            // create a chart and set the data
            // alert(data.nodes[0]);
            var chart = anychart.graph(data);

            // prevent zooming the chart with the mouse wheel
            chart.interactivity().zoomOnMouseWheel(true);

            // set the chart title
            // chart.title("Minimum Similarity: " + min_sim);

            // set the container id
            chart.container("graph-container");
            chart.title(document_name);

            // initiate drawing the chart
            chart.draw();
        });
        $('#modal-button').click();
        source_address = get_node_info_field(form_id, 'source_address');
        $('#exampleModalLabel').text(source_collection);
    }).fail(function(res) {

    });


}