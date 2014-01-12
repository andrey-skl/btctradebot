var chartsUi = {

	
	
	makeCharts : function(data, flags, lines){
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
		var series =[{
				name : 'BTC',
				type: 'candlestick',
				data : ohlc,
				id : 'quote',
				tooltip: {
					valueDecimals: 2
				}
			},{
				type : 'flags',
				data : flags,
				onSeries : 'quote',
				shape : 'circlepin',
				width : 16
			}, {
		        type: 'column',
		        name: 'Volume',
		        data: volume,
		        yAxis: 1,
		    }];

		for (var i in lines){
			series.push({
				name:i,
				data: lines[i],
			})
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
				selected : 3,
				inputEnabled : true
			},
			yAxis: [{
		        title: {
		            text: 'Trading'
		        },
		        height: 250,
		        lineWidth: 2
		    }, {
		        title: {
		            text: 'Volume'
		        },
		        top: 350,
		        height: 50,
		        offset: 0,
		        lineWidth: 2
		    }],
			series : series,
		    title: {
		        text: 'BTC/USD'
		    },
		});
	},
}