/*  
% File Structure:
1. Variables Segment
2. Functions Segment
3. Actions Segment:
    - JsPlumb Actions
    - Runing Action
**************************************************************
In this file we handle all actions in the workspase page
The actions divide into two category:
1. jsPlumb actions:
    - drag a node from nodes segment
    - drop a node into workspace
    - delete a node from workspace
    - add connection between nodes in workspace
    - delete connection from nodes
    - click on a node in workspace
2. Running Action:
    - click on run button in node_info segment
 **************************************************************
   



/*----------------------  Variables  ------------------------- */

var host = 'http://localhost:8000/';
// var host = 'https://tenat.pythonanywhere.com/';
var instance = jsPlumb.getInstance({});
let grapn_viewer_data = {}
instance.setContainer("workspace");


// color of each state
const StateColor = {
    Created: 'secondary',
    Ready: 'info',
    Running: 'warning',
    Completed: 'success',
    Failed: 'danger',
    get_state_name: function(color) {
        if (color == 'secondary') {
            return 'Created';
        } else if (color == 'info') {
            return 'Ready';
        } else if (color == 'warning') {
            return 'Running';
        } else if (color == 'success') {
            return 'Completed';
        } else if (color == 'danger') {
            return 'Failed';
        }
    }
}

//  api fields
import_collection_api_fields = { name: 'source_collection', file: 'file' };
sample_data_api_fields = { name: 'input_collection' };

// tokenization is always after import..so from = source_node
tokenization_api_fields = { name: 'source_collection', from: 'source_node', seperator: 'seperator' };

stopword_removal_api_fields = { name: 'source_collection', from: 'source_address', language: 'language' };
doc_statistics_api_fields = { name: 'source_collection', from: 'source_address', language: 'language' };
stemming_api_fields = { name: 'source_collection', from: 'source_address', language: 'language', algorithm: 'algorithm' };
lemmatizing_api_fields = { name: 'source_collection', from: 'source_address', language: 'language' };
export_file_api_fields = { name: 'source_collection', from: 'source_address', output_format: 'output_format' };
tf_idf_api_fields = { name: 'source_collection', from: 'source_address', method: 'algorithm' };
graph_construction_api_fields = { name: 'source_collection', from: 'source_address', type: 'graph_tpye', min_sim: 'min_sim' };
graph_viewer_api_fields = { name: 'source_collection', from: 'source_address' };
join_api_fields = { from1: 'from_path1', from2: 'from_path2', name1: 'name1', name2: 'name2' };

topic_modeling_api_fields = { name: 'source_collection', from: 'source_address', method: 'method', limit: 'limit' };
topic_viewer_api_fields = { name: 'source_collection', from: 'source_address', output: 'output' };
entity_recognition_api_fields = { name: 'source_collection', from: 'source_address', style: 'style' };


// api targets
let node_names = ['Entity_Recognition', 'Topic_Viewer', 'Topic_Modeling', 'Sample_Data', 'Join', 'Import_Collection', 'Tokenization', 'Stopword_Removal', 'Stemming', 'Lemmatizing', 'Doc_Statistics', 'TF_IDF', 'Graph_Construction', 'Graph_viewer', 'Export_File'];

let import_targets = ['Tokenization', 'Join'];
let sample_data_targets = ['Tokenization', 'Join'];
let tokenization_targets = node_names.filter(x => !['Tokenization', 'Graph_Viewer'].includes(x));
let stemming_targets = ['Entity_Recognition', 'Topic_Modeling', 'Join', 'Stopword_Removal', 'Lemmatizing', 'Doc_Statistics', 'TF_IDF', 'Export_File', 'Graph_Construction'];
let lemmatizing_targets = ['Entity_Recognition', 'Topic_Modeling', 'Join', 'Stopword_Removal', 'Stemming', 'Doc_Statistics', 'TF_IDF', 'Export_File', 'Graph_Construction'];
let stop_word_removal_targets = ['Entity_Recognition', 'Topic_Modeling', 'Join', 'Stemming', 'Lemmatizing', 'Doc_Statistics', 'TF_IDF', 'Export_File', 'Graph_Construction'];
let doc_statistics_targets = ['Join', 'Export_File'];
let tf_idf_targets = ['Join', 'Export_File'];
let graph_construction_targets = ['Join', 'Export_File', 'Graph_Viewer'];
let topic_modeling_targets = ['Join', 'Export_File', 'Topic_Viewer'];
let entity_recognition_targets = ['Join', 'Export_File'];

// api object
let import_collection_api = { name: 'import_collection', targets: import_targets, url: 'api/import/', fields: import_collection_api_fields }
let sample_data_api = { name: 'sample_data', targets: sample_data_targets, url: 'api/sample-data/', fields: sample_data_api_fields }
let tokenization_api = { name: 'tokenization', targets: tokenization_targets, url: 'api/tokenize/', fields: tokenization_api_fields }
let stopword_removal_api = {
    name: 'stopword_removal',
    targets: stop_word_removal_targets,
    url: 'api/stop-word-removal/',
    fields: stopword_removal_api_fields
}
let doc_statistics_api = { name: 'doc_statistics', targets: doc_statistics_targets, url: 'api/doc-statistics/', fields: doc_statistics_api_fields }
let stemming_api = { name: 'stemming', targets: stemming_targets, url: 'api/stem/', fields: stemming_api_fields }
let lemmatizing_api = { name: 'lemmatizing', targets: lemmatizing_targets, url: 'api/lemmatize/', fields: lemmatizing_api_fields }
let export_file_api = { name: 'export_file', url: 'api/export/', fields: export_file_api_fields }
let tf_idf_api = { name: 'tf_idf', targets: tf_idf_targets, url: 'api/tf-idf/', fields: tf_idf_api_fields }
let graph_construction_api = { name: 'graph_construction', targets: graph_construction_targets, url: 'api/graph-construction/', fields: graph_construction_api_fields }
let graph_viewer_api = { name: 'graph_viewr', url: 'api/graph-viewer/', fields: graph_construction_api_fields }
let join_api = { name: 'name', url: 'api/join/', fields: join_api_fields }
let topic_modeling_api = { name: 'name', url: 'api/topic-modeling/', fields: topic_modeling_api_fields }
let topic_viewer_api = { name: 'name', url: 'api/topic-viewer/', fields: topic_viewer_api_fields }
let entity_recognition_api = { name: 'name', url: 'api/entity-recognition/', fields: entity_recognition_api_fields }
    // api arrays
const APIs = {
    import_collection: import_collection_api,
    tokenization: tokenization_api,
    stopword_removal: stopword_removal_api,
    doc_statistics: doc_statistics_api,
    stemming: stemming_api,
    export_file: export_file_api,
    tf_idf: tf_idf_api,
    graph_construction: graph_construction_api,
    graph_viewer: graph_viewer_api,
    lemmatizing: lemmatizing_api,
    join: join_api,
    sample_data: sample_data_api,
    topic_modeling: topic_modeling_api,
    topic_viewer: topic_viewer_api,
    entity_recognition: entity_recognition_api

}


/*-----------------------  Functions  ------------------------- */

// function for make an uique id for each dropped node in workspace
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// function for update meta_data in node_info segment
function update_meta_data(form_selector, source_collection, source_node, source_id, source_address, current_address, state, tip) {
    // get form by form selector
    target_collection_selector = form_selector.concat(' .meta-data p.source_collection');
    target_node_selector = form_selector.concat(' .meta-data p.source_node');
    target_ID_selector = form_selector.concat(' .meta-data p.source_id');
    target_address_selector = form_selector.concat(' .meta-data p.source_address');
    target_cc_address_selector = form_selector.concat(' .meta-data p.current_address');
    target_state_selector = form_selector.concat(' .meta-data p.state');

    if (source_collection != 'default') {
        $(target_collection_selector).text(source_collection);

    }
    if (source_node != 'default') {
        $(target_node_selector).text(source_node);

    }
    if (source_id != 'default') {
        $(target_ID_selector).text(source_id);

    }

    if (source_address != 'default') {
        $(target_address_selector).text(source_address);

    }

    if (current_address != 'default') {
        $(target_cc_address_selector).text(current_address);

    }


    if (state != 'default') {
        $(target_state_selector).text(StateColor.get_state_name(state));
        text_color = 'text-'.concat(state);
        $(target_state_selector).removeClass("text-success text-info text-warning text-danger text-secondary");
        $(target_state_selector).addClass(text_color);
    }




}

// function for updating color of node in workspace segment
function update_controll_color(control_id, color) {

    text_color = 'text-'.concat(color);
    border_color = 'border-'.concat(color);
    // bg_color = 'bg-'.concat(color);

    controll_selector = 'div.control#'.concat(control_id);
    icon_selector = controll_selector.concat(' i');

    // update node name color
    $(controll_selector).removeClass("text-success text-info text-warning text-danger text-secondary");
    $(controll_selector).addClass(text_color);

    // update icon color
    $(icon_selector).removeClass("text-success text-info text-warning text-danger text-secondary");
    $(icon_selector).addClass(text_color);

    // update node border color
    $(controll_selector).removeClass("border-success border-info border-warning border-danger border-secondary");
    $(controll_selector).addClass(border_color);

    // // update node bg color
    // $(controll_selector).removeClass("bg-success bg-info bg-warning bg-danger bg-secondary");
    // $(controll_selector).addClass(bg_color);

}


// function that checks current connection is valid or not
function check_connection(source_node, target_node) {
    if (APIs[String(source_node).toLowerCase()].targets.includes(target_node)) {
        return true;
    } else { return false; }
}

// function that showes  preview and node_info segment of current node while clicked in workspace
function update_info_preview_segment(node_id) {
    $('form.my-form-control').addClass('d-none');
    form_selector = 'form#'.concat(node_id);
    $(form_selector).removeClass('d-none');
    // update preview table
    // if (node_name == 'Export_File') {
    //     node_name = 'Tokenization';
    // }

    $('#preview .table').addClass('d-none');
    table_selector = 'table#'.concat(node_id);
    $(table_selector).removeClass('d-none');
}
// function that creates appropriate table in preview segment  when a node dropped into workspace  
function create_preview_segment(node_id, draggable_element_id) {
    table_selector = 'table#'.concat(draggable_element_id)
    $('#preview .table').addClass('d-none');
    cloned_table = $(table_selector).clone(true);
    cloned_table.attr({
        'id': node_id,

    })
    cloned_table.removeClass('d-none')
    $('#preview').append(cloned_table);
}

// function that create appropriate node_info segement when a node dropped into workspace
function create_node_info_segment(node_id, draggable_element_id) {
    form_selector = 'form#'.concat(draggable_element_id);
    $('form.my-form-control').addClass('d-none');
    cloned_form = $(form_selector).clone(true, true);
    cloned_form.attr({
        'id': node_id
    });
    cloned_form.removeClass('d-none');
    $('.right_toolbox').append(cloned_form);
}


// make formData form each form by its  fields
function make_formData(form_id, fields) {
    let formData = new FormData();
    $.each(fields, function(name, value) {
        formData.append(name, get_node_info_field(form_id, value));
    });
    return formData;
}

/* ----------------------- */

drop_down_fields = ['language', 'algorithm', 'seperator', 'output_format', 'graph_type',
    'min_sim', 'node_shape', 'node_size', 'method', 'limit', 'output', 'style',
    'input_collection'
]
meta_data_fields = ['source_collection', 'source_node', 'source_id', 'source_address', 'current_address', 'state', ]
join_fields = ['name1', 'name2', 'from_path1', 'from_path2', 'node_color']

// functio for getting specific data form node parameters or node meta data
function get_node_info_field(form_id, field) {
    let field_selector = '';
    let field_value = '';
    let form_selector = 'form#'.concat(form_id);
    let p_selector = '';

    if (meta_data_fields.includes(field)) {
        p_selector = ' .meta-data p.' + field;
        field_selector = form_selector + p_selector;
        field_value = $(field_selector).text()

    } else if (drop_down_fields.includes(field)) {
        field_selector = form_selector + ' select#' + field;
        field_value = $(field_selector).find(":selected").val();

    } else if (join_fields.includes(field)) {
        p_selector = ' input#' + field;
        field_selector = form_selector + p_selector;
        field_value = $(field_selector).val()
    }
    return field_value;

}


function get_target_nodes(source_node_id) {
    let target_nodes = [];
    //  var conn = instance.getConnections({
    //      source: source_node_id,
    //  });
    //  alert(conn.source);
    var connected = instance.getConnections();
    //   var conn = instance.select({ source: form_id });
    //   alert(conn[0]);
    //  alert(connected[0].source.id);
    $.each(connected, function(e, s) {
        //connection repaint
        //  s.repaint();
        if (s.source.id == source_node_id) {
            target_nodes.push(s.target.id);
        }
        //  alert(s.source.id);
    });
    return target_nodes;
}

function update_join_parameters(form_id, input_params) {
    let form_selector = 'form#' + form_id;
    $.each(input_params, function(index, value) {
        name_selector = form_selector + ' input#name' + String(index + 1);
        from_path_selector = form_selector + ' input#from_path' + String(index + 1);

        $(name_selector).val(value.name);
        $(from_path_selector).val(value.from_path);

    });
    let name1 = get_node_info_field(form_id, 'name1').replace(/.zip/g, '').replace('.rar', '').replace('.7z', '');
    let name2 = get_node_info_field(form_id, 'name2').replace('.zip', '').replace('.rar', '').replace('.7z', '');
    let source_collection = (name1 + '_' + name2);
    let cc_address = get_node_info_field(form_id, 'current_address');
    let source_address = get_node_info_field(form_id, 'from_path1') + ', ' + get_node_info_field(form_id, 'from_path2');

    update_meta_data(form_selector, source_collection, '', '', source_address, cc_address, 'default', '');

}

function get_input_params(current_node_id) {
    let source_nodes = []
    let input_param = [];
    var connected = instance.getConnections();
    $.each(connected, function(e, s) {
        if (s.target.id == current_node_id) {
            source_nodes.push(s.source.id);
            let form_id = s.source.id;
            let source_collection = get_node_info_field(form_id, 'source_collection');
            let from_path = get_node_info_field(form_id, 'current_address');
            input_param.push({ 'form_id': form_id, 'name': source_collection, 'from_path': from_path });

        }
    });
    return input_param;
}

// update all connected nodes (meta data)
function update_connected_node(form_id) {
    target_nodes = get_target_nodes(form_id);
    source_id = form_id;
    source_node = source_id.split('-')[0];
    source_unique_id = source_id.replace(source_node + '-', '');
    source_collection = get_node_info_field(form_id, 'source_collection');
    source_cc_address = get_node_info_field(form_id, 'current_address');

    $.each(target_nodes, function(index, value) {
        target_form_selector = 'form#'.concat(value);
        update_meta_data(target_form_selector, source_collection, source_node, source_unique_id, source_cc_address, 'default', StateColor.Ready, '');
        update_controll_color(value, StateColor.Ready);

        if (get_form_class(value) == 'join') {
            update_join_parameters(value, get_input_params(value));

        }

    });

}


function update_table_data(res, form_class, form_id) {
    table_selector = 'table#'.concat(form_id) + ' tbody';
    $(table_selector).children().remove();
    $.each(res, function(index, value) {
        if (index > 0) {
            if (form_class == 'import_collection' || form_class == 'join' || form_class == 'sample_data') {
                $(table_selector).append('<tr>' + '<th scope = "row" class="col-1">' + index + '</th>' + '<td class="col-4">' + value.name + '</td>' + '<td class="col-4">' + value.text + '</td>' + '<td class="col-3">' + String(Math.round(Number(value.size) / 1000)) + '</td>' + '</tr>');

            } else if (form_class == 'tokenization') {
                $(table_selector).append('<tr>' + '<th scope = "row" class="col-1">' + index + '</th>' + '<td class="col-3">' + value.doc_name + '</td>' + '<td class="col-6">' + value.tokens + '</td>' + '<td class="col-2">' + value.tokens_count + '</td>' + '</tr>');

            } else if (form_class == 'stopword_removal') {
                $(table_selector).append('<tr>' + '<th scope = "row" class="col-1">' + index + '</th>' + '<td class="col-3">' + value.doc_name + '</td>' + '<td class="col-6">' + value.top_10_removed_words + '</td>' + '<td class="col-2">' + value.removed_count + '</td>' + '</tr>');

            } else if (form_class == 'doc_statistics') {
                $(table_selector).append('<tr>' + '<th scope = "row" class="col-1">' + index + '</th>' + '<td class="col-3">' + value.doc_name + '</td>' + '<td class="col-2">' + value.total + '</td>' + '<td class="col-2">' + value.distinct + '</td>' + '<td class="col-2">' + value.stop + '</td>' + '<td class="col-2">' + value.main + '</td>' + '</tr>');
                // $(table_selector).append('<tr>' + '<th scope = "row" class="col-1">' + index + '</th>' + '<td class="col-3">' + value.doc_name + '</td>' + '<td class="col-2">' + value.total + '</td>' + '<td class="col-6">' + value.frequent + '</td>'  + '</tr>');

            } else if (form_class == 'lemmatizing') {
                $(table_selector).append('<tr>' + '<th scope = "row" class="col-1">' + index + '</th>' + '<td class="col-3">' + value.doc_name + '</td>' + '<td class="col-6">' + value.top_lemmatized + '</td>' + '<td class="col-2">' + value.lemmatized_count + '</td>' + '</tr>');

            } else if (form_class == 'stemming') {
                $(table_selector).append('<tr>' + '<th scope = "row" class="col-1">' + index + '</th>' + '<td class="col-3">' + value.doc_name + '</td>' + '<td class="col-6">' + value.top_stemmed + '</td>' + '<td class="col-2">' + value.stemmed_count + '</td>' + '</tr>');

            } else if (form_class == 'graph_construction') {
                $(table_selector).append('<tr>' + '<th scope = "row" class="col-1">' + index + '</th>' + '<td class="col-3">' + value.source + '</td>' + '<td class="col-6">' + value.target + '</td>' + '<td class="col-2">' + value.sim + '</td>' + '</tr>');

            } else if (form_class == 'tf_idf') {

                $(table_selector).append('<tr>' + '<th scope = "row" class="col-1">' + index + '</th>' + '<td class="col-4">' + value.term + '</td>' + '<td class="col-4">' + value.doc + '</td>' + '<td class="col-2">' + value.weight + '</td>' + '</tr>');

            } else if (form_class == 'graph_viewer') {

            } else if (form_class == 'topic_modeling') {
                $(table_selector).append('<tr>' + '<th scope = "row" class="col-1">' + index + '</th>' + '<td class="col-11">' + value.topic + '</td>' + '</tr>');

            } else if (form_class == 'topic_viewer') {
                $(table_selector).append('<tr>' + '<th scope = "row" class="col-1">' + index + '</th>' + '<td class="col-11">' + value.topic + '</td>' + '</tr>');

            } else if (form_class == 'entity_recognition') {
                $(table_selector).append('<tr>' + '<th scope = "row" class="col-1">' + index + '</th>' + '<td class="col-4">' + value.entites + '</td>' + '<td class="col-4">' + value.link + '</td>' + '</tr>');

            }
        } else {
            current_address = value.file_name;
            if (typeof(value.output_path) != 'undefined') {
                current_address = value.output_path;
            }
            // if (form_class == 'import_collection') {
            //     current_address = value.file_name;
            // }
            update_meta_data(form_selector, value.file_name, 'default', 'default', 'default', current_address, 'default', '');
        }

    });
}

// send ajax request to api
function send_request(formData, url, form_id, form_class) {
    form_selector = 'form#'.concat(form_id);
    let source_address = '';
    $.ajax({
        url: url,
        data: formData,
        type: 'POST',
        contentType: false,
        processData: false,
        async: false,


    }).done(function(res) {

        update_table_data(res, form_class, form_id)
        update_meta_data(form_selector, 'default', 'default', 'default', 'default', current_address, StateColor.Completed, '');
        update_connected_node(form_id);
        setTimeout(function() {
            update_controll_color(form_id, StateColor.Completed);
        }, 500);


    }).fail(function(res) {
        setTimeout(function() {
            update_controll_color(form_id, StateColor.Failed);
        }, 500);
        update_meta_data(form_selector, 'default', 'default', 'default', 'default', 'default', StateColor.Failed, '');

    });

}



// get source node
function get_source_node(current_node_id) {
    let source_node = '';

    var connected = instance.getConnections();

    $.each(connected, function(e, s) {

        if (s.target.id == current_node_id) {
            source_node = s.source.id;
            // alert(source_node);
        }
    });
    return source_node;
}




function get_all_previous_nodes(current_node_id) {
    let previous_nodes = [];
    let cn = current_node_id;

    let connected = instance.getConnections();

    $.each(connected, function(e, s) {
        source = get_source_node(cn);
        if (source != '') {
            previous_nodes.push(source);
            cn = source;
        }

        //  alert(s.source.id);
    });
    return previous_nodes.reverse();

}



// function that runs when click on node run button (expect of import and export)
function basic_running(form_id, form_class) {

    let fid = form_id;
    current_state = get_node_info_field(fid, 'state');

    if (current_state != 'Created') { // source addrss not setted.
        fields = APIs[form_class].fields;
        url = host + APIs[form_class].url;
        formData = make_formData(fid, fields);
        send_request(formData, url, fid, form_class);

    } else { // try to set source_address
        // alert('Source address is not defined!');
        source_id = get_source_node(fid);
        button_selector = 'form#' + source_id + ' button';
        $(button_selector).click();

        if (get_node_info_field(source_id, 'state') == 'Completed') {
            let form_selector = 'form#' + fid + ' button';
            $(form_selector).click();
        }




    }

}

function get_form_class(form_id) {
    class_names = ['entity_recognition', 'topic_viewer', 'topic_modeling', 'sample_data', 'join', 'import_collection', 'tokenization', 'stopword_removal', 'stemming', 'lemmatizing', 'doc_statistics', 'tf_idf', 'graph_construction', 'graph_viewer', 'export_file'];
    form_selector = 'form#' + form_id;
    class_name = ''
    $.each(class_names, function(index, value) {
        if ($(form_selector).hasClass(value)) {
            class_name = value;
        }

    });
    return class_name;
}
/*-----------------------  Actions  ------------------------- */

instance.bind("connection", function(info) {

    //  source selector
    source_id = info.source.id;
    source_node = source_id.split('-')[0];
    source_unique_id = source_id.replace(source_node + '-', '');
    source_form_selector = 'form#'.concat(source_id);;

    source_collection = get_node_info_field(source_id, 'source_collection');

    source_state = get_node_info_field(source_id, 'state');
    current_address = get_node_info_field(source_id, 'current_address');

    //  target selector
    target_id = info.target.id;
    target_node = target_id.split('-')[0];
    target_form_selector = 'form#'.concat(target_id);



    if (source_state == 'Completed') {
        update_meta_data(target_form_selector, source_collection, source_node, source_unique_id, current_address, 'default', StateColor.Ready, '');
        update_controll_color(target_id, StateColor.Ready);
        if (get_form_class(target_id) == 'join') {
            update_join_parameters(target_id, get_input_params(target_id));

        }
    }



    if (!check_connection(source_node, target_node)) {
        var endpoints = instance.getEndpoints(target_id);
        endpoint = endpoints[0];
        //  endpoints[0].setPaintStyle({
        //      color: "red",
        //  });


        info.connection.setPaintStyle({
            stroke: "#d9534f",
            strokeWidth: 4,
        });
        info.connection.setHoverPaintStyle({
            stroke: "#d9534f",
            strokeWidth: 4,
        });
        setTimeout(function() {
            instance.deleteConnection(info.connection);
        }, 250);
    } else {
        //  var endpoints = instance.getEndpoints(target_id);
        //  endpoint = endpoints[0];
        //  endpoint.connectionType = 'green-connection';
        //  alert(endpoint.connectionType);
        //  instance.repaint(endpoint.id);
        //  setTimeout(function() {
        //      info.connection.setPaintStyle({
        //          stroke: "green",
        //      });
        //      info.connection.setHoverPaintStyle({
        //          stroke: "green",
        //      });
        //  }, 500);
        //  instance.repaint(info.connection);

    }
    //  instance.selectEndpoints({ source: element }).each(function (endpoint) {
    //     endpoint.connectorStyle.dashstyle = "2 4";
    //     instance.repaint(element);
    // });

});

instance.bind("connectionDetached", function(info) {
    //  source selector
    //  target selector
    target_id = info.target.id;
    target_form_selector = 'form#'.concat(target_id);

    update_meta_data(target_form_selector, '', '', '', '', '', StateColor.Created, '');
    update_controll_color(target_id, StateColor.Created);

});

instance.bind("zoom", function(newValue) {
    alert('zoom');
});

instance.bind("ready", function() {

    // define connection type
    instance.registerConnectionTypes({
        "gray-connection": {
            paintStyle: {
                stroke: "gray",
                strokeWidth: 2,
                // reattach: true,
                // outlineWidth: 0.5,
                // outlineStroke: 'yellow',
                // dashstyle: '2 1'
            },
            hoverPaintStyle: {
                stroke: "gray",
                strokeWidth: 8
            },
            connector: "Bezier"
        },
        "red-connection": {
            paintStyle: {
                stroke: "red",
                strokeWidth: 2,
                // reattach: true,
                // outlineWidth: 0.5,
                // outlineStroke: 'yellow',
                // dashstyle: '2 1'
            },
            hoverPaintStyle: {
                stroke: "red",
                strokeWidth: 8
            },
            connector: "Bezier"
        },

        "green-connection": {
            paintStyle: {
                stroke: "red",
                strokeWidth: 2,
                // reattach: true,
                // outlineWidth: 0.5,
                // outlineStroke: 'yellow',
                // dashstyle: '2 1'
            },
            hoverPaintStyle: {
                stroke: "red",
                strokeWidth: 8
            },
            connector: "Bezier"
        }

    });
    // instance.draggable("control1", {
    //     "containment": true
    // });
    // instance.draggable("control2", {
    //     "containment": true
    // })
    // instance.addEndpoint("control1", {
    //     endpoint: "Dot", // rectangle, blank, image
    //     anchor: ["RightMiddle"],
    //     isSource: true,
    //     connectionType: "red-connection",
    //     maxConnections: 10
    // });
    // instance.addEndpoint("control2", {
    //     endpoint: "Dot",
    //     anchor: ["LeftMiddle"],
    //     isTarget: true,
    //     connectionType: "red-connection",
    //     maxConnections: 10
    // });

    // https://stackoverflow.com/a/4502207

    /* --------delete connection button-------------- */
    instance.bind("contextmenu", function(component, event) {
        if (component.hasClass("jtk-connector")) {
            event.preventDefault();
            window.selectedConnection = component;
            $("<div class='custom-menu'><button class='delete-connection'>Delete connection</button></div>")
                .appendTo("body")
                .css({
                    top: event.pageY + "px",
                    left: event.pageX + "px"
                });
        }
    });

    $("body").on("click", ".delete-connection", function(event) {
        instance.deleteConnection(window.selectedConnection);
    });

    $(document).bind("click", function(event) {
        $("div.custom-menu").remove();
    });
    /* --------#########################-------------- */

    /* --------delete controll button-------------- */
    $("body").on("contextmenu", "#workspace .control", function(event) {
        event.preventDefault();
        delete_count = $('.delete-control').length
        if (delete_count == 0) {
            window.selectedControl = $(this).attr("id");
            $("<div class='custom-menu'><button class='delete-control'>Delete control</button>")
                // $("<div class='custom-menu'><button class='delete-control'>Delete control</button><button class='run-control'>Run</button></div>")
                .appendTo("body")
                .css({
                    top: event.pageY + "px",
                    left: event.pageX + "px",
                    // background: 'red',
                });

        }

    });

    $("body").on("click", ".delete-control", function(event) {
        node_id = (window.selectedControl);
        //  alert(node_id);
        // remove node info form and preview table
        form_selector = 'form#'.concat(node_id);
        $(form_selector).remove();
        table_selector = 'table#'.concat(node_id);
        $(table_selector).remove();
        instance.remove(window.selectedControl);

    });
    /* --------#########################-------------- */

    $("#toolbox .control").draggable({
        helper: "clone",
        containment: "body",
        appendTo: "#workspace"
    });
    /* ---------workspace droppable actions-------------------- */


    $("#workspace").droppable({
        drop: function(event, ui) {

            /*------ make a copy of dragged node and append it to the workspace -----------*/
            var unique_id = uuidv4();
            var clone = $(ui.helper).clone(true);
            var draggable_element_id = ui.draggable.prop('id');
            var node_id = draggable_element_id.concat(('-' + unique_id));
            clone.attr("id", node_id);
            clone.attr('name', draggable_element_id);
            clone.appendTo(this);
            instance.draggable(node_id, {
                containment: true
            });
            /* --------#########################--------- */

            // var s = $('._jsPlumb_endpoint:first').data()
            // alert(s);

            /*------ setting endpoint of each dropped node -----------*/
            if (draggable_element_id.includes('Import') || draggable_element_id.includes('Sample_Data')) {
                instance.addEndpoint(node_id, {
                    endpoint: "Dot",
                    anchor: ["RightMiddle"],
                    isSource: true,
                    connectionType: "gray-connection",
                    maxConnections: 10
                });

            } else if (draggable_element_id.includes('Export') || draggable_element_id.includes('Graph_Viewer') || draggable_element_id.includes('Topic_Viewer')) {
                instance.addEndpoint(node_id, {
                    endpoint: "Dot",
                    anchor: ["LeftMiddle"],
                    isTarget: true,
                    connectionType: "gray-connection",
                    maxConnections: 1
                });
            } else if (draggable_element_id.includes('Join')) {
                instance.addEndpoint(node_id, {
                    endpoint: "Dot",
                    anchor: [0, 0.25, -1, 0],
                    isTarget: true,
                    connectionType: "gray-connection",
                    maxConnections: 1
                });
                instance.addEndpoint(node_id, {
                    endpoint: "Dot",
                    anchor: [0, 0.75, -1, 0],
                    isTarget: true,
                    connectionType: "gray-connection",
                    maxConnections: 1
                });
                instance.addEndpoint(node_id, {
                    endpoint: "Dot",
                    anchor: ["RightMiddle"],
                    isSource: true,
                    connectionType: "gray-connection",
                    maxConnections: 10,
                });
            } else {
                instance.addEndpoint(node_id, {
                    endpoint: "Dot",
                    anchor: ["LeftMiddle"],
                    isTarget: true,
                    connectionType: "gray-connection",
                    maxConnections: 1

                });
                instance.addEndpoint(node_id, {
                    endpoint: "Dot",
                    anchor: ["RightMiddle"],
                    isSource: true,
                    connectionType: "gray-connection",
                    maxConnections: 10
                });
            }

            /* --------#########################--------- */
            if (draggable_element_id.includes('Sample_Data')) {
                update_controll_color(node_id, StateColor.Ready);
            } else {
                update_controll_color(node_id, StateColor.Created);

            }

            // Create Info Segment
            create_node_info_segment(node_id, draggable_element_id);

            // Create preview selection
            create_preview_segment(node_id, draggable_element_id);
            $('#workspace .control').css({ 'box-shadow': '', 'border-width': '2px' });
            $(clone).css({ 'box-shadow': '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', 'border-width': '4px' });
            /* --------#########################--------- */

            // table_selector = 'table#'.concat(draggable_element_id);
            // $(table_selector).removeClass('d-none');

            // jsPlumb.removeAllEndpoints("import");
            // var endpoints = plumbInstance.getEndpoints(id);
            // alert(endpoints);
            // jsPlumb.deleteEndpoint(endpoint[0]);

        }
    })


    // update preview & node info segment when click on a node in workspace
    $("body").on("click", "#workspace .control", function(event) {

        node_name = $(this).attr('name');
        node_id = $(this).attr('id');
        // alert(node_id);
        update_info_preview_segment(node_id);
        $('#workspace .control').css({ 'box-shadow': '', 'border-width': '2px' });
        $(this).css({ 'box-shadow': '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', 'border-width': '4px' });
        //  $(this).addClass('font-italic');

    });

    /* --------############    Run Controller      #############--------- */

    /*-----------------------  Runnig Segment  -------------------------*/


    function correct_address_node_names(address) {
        return address.replace('media/result/', '').replace('stop_word', 'stopword_removed').replace('/', '_').concat('_output');
    }

    function download_file(url, form_id, sequence_address) {
        file_name = get_node_info_field(form_id, 'source_collection');
        source_node = get_node_info_field(form_id, 'source_node');
        form_selector = 'form#'.concat(form_id);
        file_name_wo_extention = file_name.split('.').slice(0, -1).join('.')

        $.ajax({
            url: url,
            method: 'GET',
            xhrFields: {
                responseType: 'blob',

            },
            success: function(data) {
                format_selector = 'form#'.concat(form_id) + ' #output_format';
                var output_format = $(format_selector).find(":selected").text();
                var output_node = correct_address_node_names(sequence_address);
                output_node = output_node.replace(file_name, '');
                var a = document.createElement('a');
                var url = window.URL.createObjectURL(data);
                a.href = url;
                a.download = file_name_wo_extention + '_' + output_node + output_format;
                document.body.append(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
                update_controll_color(form_id, StateColor.Completed);
                update_meta_data(form_selector, 'default', 'default', 'default', 'default', 'default', StateColor.Completed, '');
            }

        }).fail(function(res) {
            alert('f');
            update_controll_color(form_id, StateColor.Failed);
            update_meta_data(form_selector, 'default', 'default', 'default', 'default', 'default', StateColor.Failed, '');


        });
    }




    $('form button').click(function() {

        form_id = $(this).closest('form').attr('id');
        form_class = get_form_class(form_id);
        // alert(form_class);
        temp = ['export_file', 'import_collection', 'graph_viewer'];


        update_controll_color(form_id, StateColor.Running);


        if (!temp.includes(form_class)) {

            basic_running(form_id, form_class);

            // import collection running
        } else if (form_class == 'import_collection') {


            // chceck duplicate connection at binding
            //  var con = info.connection;
            //  var arr = jsPlumb.select({ source: con.sourceId, target: con.targetId });
            //  if (arr.length > 1) {
            //      jsPlumb.detach(con);
            //  }


            form_id = $(this).closest('form').attr('id');
            file_uploader_selector = '#' + form_id.concat(' #FilUploader');
            file_uploader = $(file_uploader_selector)[0];



            //  var connected = instance.getConnections();
            //  var conn = jsPlumb.select({ source: form_id });
            //  alert(conn[0].id);
            //  //  alert(connected[0].source.id);
            //  $.each(connected, function(e, s) {
            //      //connection repaint
            //      s.repaint();

            //      //  alert(s.source.id);
            //      //  alert(s.target.id);
            //  });

            var numFiles = file_uploader.files ? file_uploader.files.length : 1;
            if (numFiles < 1) {
                alert('Import a collection!');
            } else {
                text_input_selector = '#' + form_id.concat(' #text-input');
                var formData = new FormData();
                file_name = $(text_input_selector).val();


                source_form_selector = 'form#'.concat(form_id);;
                source_collection_selector = source_form_selector.concat(' .meta-data p.source_collection');
                //  alert($(source_form_selector).attr('id'));

                $(source_collection_selector).text(file_name);
                formData.append('name', file_name); //این فیلد را می توانی حذف کنی
                formData.append('file', file_uploader.files[0]);
                url = host + 'api/import/';
                // alert(file_uploader[0].files[0]);
                send_request(formData, url, form_id, 'import_collection');
            }

        } else if (form_class == 'export_file') {

            // alert(instance.getConnections()[0]);
            form_id = $(this).closest('form').attr('id');
            current_state = get_node_info_field(form_id, 'state');
            if (current_state != 'Created') {
                form_class = 'export_file';
                form_selector = 'form#'.concat(form_id);
                source_address = get_node_info_field(form_id, 'source_address');


                fields = APIs[form_class].fields;
                url = host + APIs[form_class].url;
                formData = make_formData(form_id, fields);

                // alert($('#FilUploader')[0].files[0]);
                $.ajax({
                    //  url: "https://localhost:8000/api/export/",
                    url: host + export_file_api.url,
                    data: formData,
                    type: 'POST',
                    contentType: false,
                    processData: false,
                }).done(function(res) {
                    file_src = host + res;
                    download_file(file_src, form_id, source_address);

                }).fail(function(res) {
                    update_controll_color(form_id, StateColor.Failed);
                    update_meta_data(form_selector, 'default', 'default', 'default', 'default', 'default', StateColor.Failed, '');
                });
            } else {
                source_id = get_source_node(form_id);
                button_selector = 'form#' + source_id + ' button';
                $(button_selector).click();

                let form_selector = 'form#' + form_id + ' button';
                $(form_selector).click();
            }



        } else if (form_class == 'graph_viewer') {
            // alert(instance.getConnections()[0]);
            form_id = $(this).closest('form').attr('id');
            current_state = get_node_info_field(form_id, 'state');
            if (current_state != 'Created') {
                form_class = 'graph_viewer';
                form_selector = 'form#'.concat(form_id);
                source_address = get_node_info_field(form_id, 'source_address');
                source_collection = get_node_info_field(form_id, 'source_collection');


                fields = APIs[form_class].fields;
                url = host + APIs[form_class].url;
                formData = make_formData(form_id, fields);

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

                        source_form_id = 'Graph_Construction-' + get_node_info_field(form_id, 'source_id');
                        min_sim = get_node_info_field(source_form_id, 'min_sim')
                        shape = get_node_info_field(form_id, 'node_shape');
                        size = parseInt(get_node_info_field(form_id, 'node_size'));
                        node_color = get_node_info_field(form_id, 'node_color');
                        // set the chart title
                        chart.title("Minimum Similarity: " + min_sim);

                        // set the container id
                        chart.container("graph-container");
                        var nodes = chart.nodes();

                        // set the size of nodes
                        nodes.normal().shape(shape);
                        nodes.normal().height(size);
                        nodes.hovered().height(size + 10);
                        nodes.selected().height(size + 10);




                        // set the fill of nodes
                        nodes.normal().fill(node_color);
                        nodes.hovered().fill(node_color);
                        nodes.selected().fill('white');

                        // set the stroke of nodes
                        nodes.normal().stroke(null);
                        nodes.hovered().stroke(node_color, 3);
                        nodes.selected().stroke(node_color, 3);

                        // initiate drawing the chart
                        chart.draw();
                    });
                    $('#modal-button').click();

                    update_controll_color(form_id, StateColor.Completed);
                    update_meta_data(form_selector, 'default', 'default', 'default', 'default', 'default', StateColor.Completed, '');
                    source_address = get_node_info_field(form_id, 'source_address');
                    $('#exampleModalLabel').text(source_collection);
                }).fail(function(res) {

                });
            } else {

                source_id = get_source_node(form_id);
                button_selector = 'form#' + source_id + ' button';
                $(button_selector).click();
                if (get_node_info_field(source_id, 'state') == 'Completed') {

                    let form_selector = 'form#' + form_id + ' button';
                    $(form_selector).click();
                }

            } //else

        }
    })


    // export Run


});