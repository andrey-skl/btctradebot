var chartsUi = {

	makeSeries: function(data, flags, lines){
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


		return series;
	},
	
	makeCharts : function(data, flags, lines){
		
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
			series : chartsUi.makeSeries(data, flags, lines),
		    title: {
		        text: 'BTC/USD'
		    },
		});
	},

	redrawWithNewData: function(data, flags, lines){
		var chart = $('#container').highcharts();
		var newSeries =chartsUi.makeSeries(data, flags, lines);

		var len = newSeries.length;

		for(i = 0;i<len;i++)
		{
			var se = chart.series[i];
			if (se){
		    	chart.series[i].setData(newSeries[i],false);
			} else {
				chart.addSeries(newSeries[i], false);
			}
		}

		chart.redraw();
	},

	addPeriod: function(data, flags, lines){
		var chart = $('#container').highcharts();        
		var lastDateStamp = data[data.length-1].date.getTime();

        var newFlag = (flags.length && flags[flags.length-1].x == lastDateStamp) ? flags[flags.length-1] : null;

			var index = data.length-1;
	        chart.series[0].addPoint(
	        	[data[index].date.getTime(),
	        	data[index].open, // open
				data[index].max, // high
				data[index].min, // low
				data[index].close 
	        	], false, true);

	        newFlag && chart.series[1].addPoint([newFlag.x, newFlag.y], false, false);

	        chart.series[2].addPoint([data[index].date.getTime(),data[index].volume], true, false, true);

	        if (lines){
	        	var i = 3;
	        	for (var j in lines){
	        		line = lines[j];
	        		var ser = chart.series[i];
        			ser.addPoint(line[line.length-1], true, false, true);

	        		i += 1;
	        	}
	        }


	}
}