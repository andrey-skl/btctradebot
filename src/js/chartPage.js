
var back = chrome.extension.getBackgroundPage();

$(function() {

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/clouds");
    editor.getSession().setMode("ace/mode/javascript");

    $("#saveStrategy").on("click", function(e){
    	var strategySrc = editor.getValue();
    	localStorage.strategy = strategySrc;
    });

    var loadStrategy = function(){
    	return localStorage.strategy;
    }

	var makeCharts = function(data, flags, lines){
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
				data: lines[i]
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
			series : series,
		    title: {
		        text: 'BTC/USD'
		    },
		});
	}

	var strategy = loadStrategy();

	editor.setValue(strategy);

	var trader = new tradeCore(back.btceApi, strategy);

	var flags = [];


	trader.addBuyListener(function(rate, amount){
		console.log("buyed",rate, amount, this.lastDate);
		//console.table(this.graphs["EMA3"]);
		//console.table(this.graphs["EMA10"]);
		flags.push({
			x: this.lastDate.getTime(),
			title:"B",
		});
	});
	trader.addSellListener(function(rate, amount){
		console.log("selled",rate, amount);
		flags.push({
			x: this.lastDate.getTime(),
			title:"S",
		});
	});

	var tester = new backTester(back.table, trader);
	console.log("Start backtest trading...");
	tester.test();

	makeCharts(back.table, flags, trader.graphs);


});