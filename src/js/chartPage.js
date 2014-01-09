	//chart docs https://google-developers.appspot.com/chart/interactive/docs/gallery/candlestickchart#Example
//$(function(){
	google.load('visualization', '1', {packages: ['corechart']});

	var back = chrome.extension.getBackgroundPage();

	//converting charts array to vizualizable array
	var vizualizeArray = [];
	for (var i in back.table){
		var row = back.table[i];
		vizualizeArray.push([
				row[0].toString(),
				row[5],
				row[3],
				row[4],
				row[6]
			])
	}
	
	function drawVisualization() {
		//data format: name, low, open, close, max, tooltip"
        var data = google.visualization.arrayToDataTable(vizualizeArray, true);

        var options = {
          legend:'none',
          hollowIsRising: true,
        };

        var chart = new google.visualization.CandlestickChart(document.getElementById('chart'));
        chart.draw(data, options);
	  }

	  google.setOnLoadCallback(drawVisualization);
//});
