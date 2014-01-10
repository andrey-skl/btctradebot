
	var back = chrome.extension.getBackgroundPage();

	//converting charts array to vizualizable array
	var vizualizeArray = [];
	for (var i in back.table){
		var row = back.table[i];
		vizualizeArray.push([
				row.date.toString(),
				row.min,
				row.open,
				row.close,
				row.max
			])
	}

$(function() {
		var data = back.table;

// split the data set into ohlc and volume
		var ohlc = [],
			volume = [],
			dataLength = data.length;
			
		for (i = 0; i < dataLength; i++) {
			ohlc.push([
				data[i].date.getTime(), // the date
				data[i].open, // open
				data[i].max, // high
				data[i].min, // low
				data[i].close // close
			]);
			
			volume.push([
				data[i].date.getTime(), // the date
				data[i].volume // the volume
			])
		}


		// create the chart
		$('#container').highcharts('StockChart', {
		    rangeSelector : {
				buttons : [{
					type : 'hour',
					count : 1,
					text : '1h'
				}, {
					type : 'day',
					count : 1,
					text : '1D'
				}, {
					type : 'all',
					count : 1,
					text : 'All'
				}],
				selected : 1,
				inputEnabled : false
			},
			yAxis: [{
		        title: {
		            text: 'OHLC'
		        },
		        height: 200,
		        lineWidth: 2
		    }, {
		        title: {
		            text: 'Volume'
		        },
		        top: 300,
		        height: 100,
		        offset: 0,
		        lineWidth: 2
		    }],
			series : [{
				name : 'BTC',
				type: 'candlestick',
				data : ohlc,
				tooltip: {
					valueDecimals: 2
				}
			}, {
		        type: 'column',
		        name: 'Volume',
		        data: volume,
		        yAxis: 1,
		    }],


		    title: {
		        text: 'BTC/USD'
		    },
/*
		    yAxis: [{
		        title: {
		            text: 'OHLC'
		        },
		        height: 200,
		        lineWidth: 2
		    }, {
		        title: {
		            text: 'Volume'
		        },
		        top: 300,
		        height: 100,
		        offset: 0,
		        lineWidth: 2
		    }],*/
		    /*
		    series: [{
		        type: 'candlestick',
		        name: 'AAPL',
		        data: ohlc,
		    }, {
		        type: 'column',
		        name: 'Volume',
		        data: volume,
		        yAxis: 1,
		    }]*/
		});
});