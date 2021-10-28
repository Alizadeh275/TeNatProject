  // Define the function 
  // to screenshot the div
  function jpeg() {
      anychart.onDocumentReady(function() {
          var chart = anychart.getChartById('graph_chart');
          chart.saveAsPdf();

      });
  }

  function takeshot() {
      let div =
          document.getElementById('snapshot');

      // Use the html2canvas
      // function to take a screenshot
      // and append it
      // to the output div
      html2canvas(div).then(
          function(canvas) {
              document
                  .getElementById('output')
                  .appendChild(canvas);

              var a = document.createElement('a');
              // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
              a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
              a.download = 'graph.png';
              a.click();

          })
  }