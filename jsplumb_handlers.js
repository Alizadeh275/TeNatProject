 // https://stackoverflow.com/a/2117523

 // function for make an uique id for each dropped node in workspace
 function uuidv4() {
     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
         var r = Math.random() * 16 | 0,
             v = c == 'x' ? r : (r & 0x3 | 0x8);
         return v.toString(16);
     });
 }
 instance = jsPlumb.getInstance({});
 instance.setContainer("workspace");

 instance.bind("connection", function(info) {
     //  source selector
     source_id = info.source.id;
     source_node = source_id.split('-')[0];
     source_unique_id = source_id.replace(source_node + '-', '');
     source_form_selector = 'form#'.concat(source_id);;
     source_collection_selector = source_form_selector.concat(' .meta-data p.source_collection');
     state_selector = source_form_selector.concat(' .meta-data p.state');

     //  target selector
     target_id = info.target.id;
     target_form_selector = 'form#'.concat(target_id);
     target_collection_selector = target_form_selector.concat(' .meta-data p.source_collection');
     target_node_selector = target_form_selector.concat(' .meta-data p.source_node');
     target_ID_selector = target_form_selector.concat(' .meta-data p.source_id');
     target_state_selector = target_form_selector.concat(' .meta-data p.state');

     $(target_collection_selector).text($(source_collection_selector).text());
     $(target_node_selector).text(source_node);
     $(target_ID_selector).text(source_unique_id);
     $(target_state_selector).text('Ready');

 });

 instance.bind("connectionDetached", function(info) {
     //  source selector
     source_id = info.source.id;
     source_node = source_id.split('-')[0];
     source_unique_id = source_id.replace(source_node + '-', '');
     source_form_selector = 'form#'.concat(source_id);;
     source_collection_selector = source_form_selector.concat(' .meta-data p.source_collection');
     state_selector = source_form_selector.concat(' .meta-data p.state');

     //  target selector
     target_id = info.target.id;
     target_form_selector = 'form#'.concat(target_id);
     target_collection_selector = target_form_selector.concat(' .meta-data p.source_collection');
     target_node_selector = target_form_selector.concat(' .meta-data p.source_node');
     target_ID_selector = target_form_selector.concat(' .meta-data p.source_id');
     target_state_selector = target_form_selector.concat(' .meta-data p.state');

     $(target_collection_selector).text('');
     $(target_node_selector).text('');
     $(target_ID_selector).text('');
     $(target_state_selector).text('Created');

 });

 instance.bind("zoom", function(newValue) {
     alert('zoom');
 });

 instance.bind("ready", function() {

     // define connection type
     instance.registerConnectionTypes({
         "red-connection": {
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

     // #######################################################
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

     // #######################################################

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
             if (draggable_element_id.includes('Import')) {
                 instance.addEndpoint(node_id, {
                     endpoint: "Dot",
                     anchor: ["RightMiddle"],
                     isSource: true,
                     connectionType: "red-connection",
                     maxConnections: 10
                 });
             } else if (draggable_element_id.includes('Export')) {
                 instance.addEndpoint(node_id, {
                     endpoint: "Dot",
                     anchor: ["LeftMiddle"],
                     isTarget: true,
                     connectionType: "red-connection",
                     maxConnections: 1
                 });
             } else {
                 instance.addEndpoint(node_id, {
                     endpoint: "Dot",
                     anchor: ["LeftMiddle"],
                     isTarget: true,
                     connectionType: "red-connection",
                     maxConnections: 10

                 });
                 instance.addEndpoint(node_id, {
                     endpoint: "Dot",
                     anchor: ["RightMiddle"],
                     isSource: true,
                     connectionType: "red-connection",
                     maxConnections: 10
                 });
             }

             /* --------#########################--------- */

             // Create Info Segment
             create_node_info_segment(node_id, draggable_element_id);

             // Create preview selection
             create_preview_segment(node_id, draggable_element_id);

             /* --------#########################--------- */

             // table_selector = 'table#'.concat(draggable_element_id);
             // $(table_selector).removeClass('d-none');

             // jsPlumb.removeAllEndpoints("import");
             // var endpoints = plumbInstance.getEndpoints(id);
             // alert(endpoints);
             // jsPlumb.deleteEndpoint(endpoint[0]);

         }
     })


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

     // update preview & node info segment when click on a node in workspace
     $("body").on("click", ".control", function(event) {

         node_name = $(this).attr('name');
         node_id = $(this).attr('id');
         // alert(node_id);
         update_info_preview_segment(node_id);

     });

     /* --------############    Run Controller      #############--------- */

     function set_form_data(form_id) {
         let formData;
         source_collection_selector = 'form#'.concat(form_id) + ' .meta-data p.source_collection';
         file_name = $(source_collection_selector).text();

         language_selector = 'form#'.concat(form_id) + ' select#inputState';
         language = $(language_selector).find(":selected").text();
         source_node_selector = 'form#'.concat(form_id) + ' .meta-data p.source_node';
         source_node = $(source_node_selector).text();

         return formData;
     }

     function get_file_name(form_id) {
         source_collection_selector = 'form#'.concat(form_id) + ' .meta-data p.source_collection';
         file_name = $(source_collection_selector).text();
         return file_name;
     }

     function get_language(form_id) {
         language_selector = 'form#'.concat(form_id) + ' select#inputState';
         language = $(language_selector).find(":selected").text();
         return language;
     }


     function get_source_node(form_id) {
         source_node_selector = 'form#'.concat(form_id) + ' .meta-data p.source_node';
         source_node = $(source_node_selector).text();
         return source_node;
     }

     function send_request(formData, url, form_id, form_class) {
         state_selector = 'form#'.concat(form_id) + ' .meta-data p.state';
         $.ajax({
             url: url,
             data: formData,
             type: 'POST',
             contentType: false,
             processData: false
         }).done(function(res) {
             table_selector = 'table#'.concat(form_id) + ' tbody';
             $(table_selector).children().remove();
             $.each(res, function(index, value) {
                 if (form_class == 'import_collection') {
                     $(table_selector).append('<tr>' + '<th scope = "row" class="col-1">' + index + '</th>' + '<td class="col-4">' + value.name + '</td>' + '<td class="col-4">' + value.text + '</td>' + '<td class="col-3">' + String(Math.round(Number(value.size) / 1000)) + '</td>' + '</tr>');

                 } else if (form_class == 'tokenization') {
                     $(table_selector).append('<tr>' + '<th scope = "row" class="col-1">' + index + '</th>' + '<td class="col-3">' + value.doc_name + '</td>' + '<td class="col-6">' + value.tokens + '</td>' + '<td class="col-2">' + value.tokens_count + '</td>' + '</tr>');

                 } else if (form_class == 'stopword_removal') {
                     $(table_selector).append('<tr>' + '<th scope = "row" class="col-1">' + index + '</th>' + '<td class="col-3">' + value.doc_name + '</td>' + '<td class="col-6">' + value.top_10_removed_words + '</td>' + '<td class="col-2">' + value.removed_count + '</td>' + '</tr>');

                 } else if (form_class == 'doc_statistics') {
                     $(table_selector).append('<tr>' + '<th scope = "row" class="col-1">' + index + '</th>' + '<td class="col-3">' + value.doc_name + '</td>' + '<td class="col-2">' + value.total + '</td>' + '<td class="col-2">' + value.distinct + '</td>' + '<td class="col-2">' + value.stop + '</td>' + '<td class="col-2">' + value.main + '</td>' + '</tr>');

                 } else if (form_class == 'stemming') {
                     $(table_selector).append('<tr>' + '<th scope = "row" class="col-1">' + index + '</th>' + '<td class="col-3">' + value.doc_name + '</td>' + '<td class="col-6">' + value.top_stemmed + '</td>' + '<td class="col-2">' + value.stemmed_count + '</td>' + '</tr>');

                 }
             });
             $(state_selector).text('Completed');

         }).fail(function(res) {
             $(state_selector).text('Failed');
             $(state_selector).addClass('text-danger');

         });
     }
     // import collection run
     $('form.import_collection button').click(function() {
         form_id = $(this).closest('form').attr('id');
         file_uploader_selector = '#' + form_id.concat(' #FilUploader');
         file_uploader = $(file_uploader_selector)[0];

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
             url = 'https://tenat.pythonanywhere.com/api/import/';
             // alert(file_uploader[0].files[0]);
             send_request(formData, url, form_id, 'import_collection')
         }

     });



     // tokenization Run
     $('form.tokenization button').click(function() {

         var formData = new FormData();

         form_id = $(this).closest('form').attr('id');
         file_name = get_file_name(form_id);
         source_node = get_source_node(form_id);
         formData.append('name', file_name);
         formData.append('from', source_node);
         formData.append('splitter', ' ');
         url = 'https://tenat.pythonanywhere.com/api/tokenize/';
         send_request(formData, url, form_id, 'tokenization');
     });

     // stw_run Run
     $('form.stopword_removal button').click(function() {
         var formData = new FormData();

         form_id = $(this).closest('form').attr('id');
         file_name = get_file_name(form_id);
         language = get_language(form_id);
         source_node = get_source_node(form_id);

         formData.append('name', file_name);
         formData.append('from', source_node);
         formData.append('language', language);
         url = 'https://tenat.pythonanywhere.com/api/stop-word-removal/';
         send_request(formData, url, form_id, 'stopword_removal');
     });


     // doc_statistics Run
     $('form.doc_statistics button').click(function() {
         var formData = new FormData();
         form_id = $(this).closest('form').attr('id');
         file_name = get_file_name(form_id);
         language = get_language(form_id);
         source_node = get_source_node(form_id);

         formData.append('name', file_name);
         formData.append('from', source_node);
         formData.append('language', language);
         url = 'https://tenat.pythonanywhere.com/api/doc-statistics/';
         send_request(formData, url, form_id, 'doc_statistics');

     });

     // doc_statistics Run
     $('form.stemming button').click(function() {
         var formData = new FormData();
         form_id = $(this).closest('form').attr('id');
         file_name = get_file_name(form_id);
         language = get_language(form_id);
         source_node = get_source_node(form_id);

         formData.append('name', file_name);
         formData.append('from', source_node);
         formData.append('language', language);
         url = 'https://tenat.pythonanywhere.com/api/stem/';
         send_request(formData, url, form_id, 'stemming');

     });


     function download_file(url, form_id, node_class) {
         source_collection_selector = 'form#'.concat(form_id) + ' .meta-data p.source_collection';
         source_node_selector = 'form#'.concat(form_id) + ' .meta-data p.source_node';
         file_name = $(source_collection_selector).text();
         source_node = $(source_node_selector).text();
         // file_name = $('#text-input').val();
         file_name_wo_extention = file_name.split('.').slice(0, -1).join('.')
         state_selector = 'form#'.concat(form_id) + ' .meta-data p.state';
         $.ajax({
             url: url,
             method: 'GET',
             xhrFields: {
                 responseType: 'blob',

             },
             success: function(data) {
                 form_selector = 'form#'.concat(form_id) + ' #export_data_output_format';
                 var output_format = $(form_selector).find(":selected").text();
                 var output_node = node_class.concat('_output');
                 var a = document.createElement('a');
                 var url = window.URL.createObjectURL(data);
                 a.href = url;
                 a.download = file_name_wo_extention + '_' + output_node + output_format;
                 document.body.append(a);
                 a.click();
                 a.remove();
                 window.URL.revokeObjectURL(url);
                 $(state_selector).text('Completed');
             }
         }).fail(function(res) {
             $(state_selector).text('Failed');
             $(state_selector).addClass('text-danger');

         });
     }
     // export Run
     $('form.export_file button').click(function() {

         // alert(instance.getConnections()[0]);

         form_id = $(this).closest('form').attr('id');

         file_name = get_file_name(form_id);
         source_node = get_source_node(form_id);
         var formData = new FormData();
         // file_name = $('#text-input').val();
         //  file_name_wo_extention = file_name.split('.').slice(0, -1).join('.')
         //  state_selector = 'form#'.concat(form_id) + ' .meta-data p.state';

         formData.append('name', file_name);
         formData.append('from', source_node);
         formData.append('format', '.txt');
         // alert($('#FilUploader')[0].files[0]);
         $.ajax({
             //  url: "https://localhost:8000/api/export/",
             url: "https://tenat.pythonanywhere.com/api/export/",
             data: formData,
             type: 'POST',
             contentType: false,
             processData: false
         }).done(function(res) {
             file_src = 'https://tenat.pythonanywhere.com/' + res;
             download_file(file_src, form_id, source_node);

         });
     });



 });