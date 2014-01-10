
var back = chrome.extension.getBackgroundPage();

$(function() {
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

	var strategy = "\
	var strategyProcessor = function(api, trader){\
		var pauseLength = 5;\
		var iterator = pauseLength;\
		var isBuyed = false;\
		var summ = 0;\
		var lastBuyPrice = 0;\
		var stopLoss = 10;\
		var takeProfit = 40;\
		var emaMinGraph = trader.addChart('EMA3');\
		var emaMaxGraph = trader.addChart('EMA10');\
		this.handlePeriod= function(tradeData){\
			if (iterator>0)\
				iterator--;\
			var lastPrice = tradeData[tradeData.length-1].close;\
			var lastDate = tradeData[tradeData.length-1];\
			var closedPrices = [];\
			for (var i in tradeData){\
				closedPrices.push(tradeData[i].close);\
			}\
			var minEmaPeriod = 3;\
			var maxEmaPeriod = 10;\
			var minEmaOffset =maxEmaPeriod-minEmaPeriod;\
			var lastEmaLength = 4;\
			var ema4 = TA.EMAverage(closedPrices, minEmaPeriod);\
			var ema8 = TA.EMAverage(closedPrices, maxEmaPeriod);\
			/*var ROC = TA.Roc(closedPrices, 10);*/\
\
			var lastEmas = [];\
			/*filling last emas*/	\
			for (var i=0; i<lastEmaLength; i++ ){\
				lastEmas.push({\
					ema4: ema4[ema4.length -minEmaPeriod-minEmaOffset -lastEmaLength+ i+1 ],\
					ema8: ema8[ema8.length - maxEmaPeriod -lastEmaLength+ i+1 ]\
				});\
			}	\
			emaMinGraph.push([trader.lastDate.getTime(),lastEmas[lastEmas.length-1].ema4]);\
			emaMaxGraph.push([trader.lastDate.getTime(),lastEmas[lastEmas.length-1].ema8]);\
			/*searching upper cross*/\
			for (var i = 1; i<lastEmas.length; i++){\
				var prevEmas = lastEmas[i-1];\
				var lastEma = lastEmas[i];\
				if (!prevEmas.ema4 || !prevEmas.ema8 || !lastEma.ema4 || !lastEma.ema8)\
					continue;\
				if (prevEmas.ema4 < prevEmas.ema8 && lastEma.ema4 > lastEma.ema8){\
					if (iterator==0 && !isBuyed) {\
						api.buy(lastPrice,1);iterator=pauseLength;isBuyed=true;\
						lastBuyPrice = lastPrice;\
					}\
				} else if (prevEmas.ema4 > prevEmas.ema8 && lastEma.ema4 < lastEma.ema8){\
					if (iterator==0 && isBuyed) {\
						api.sell(lastPrice,1);iterator=pauseLength;isBuyed = false;\
						summ+=lastPrice-lastBuyPrice;\
						console.log('win:'+summ);\
					}\
				}\
				if (isBuyed && lastPrice<lastBuyPrice-stopLoss){\
					console.warn('stopLoss shouted!!!', trader.lastDate);\
					api.sell(lastPrice,1);iterator=pauseLength;isBuyed = false;\
					summ+=lastPrice-lastBuyPrice;\
					console.log('win:'+summ);\
				}\
				if (isBuyed && lastPrice>lastBuyPrice+takeProfit){\
					console.warn('takeProfit shouted!!!');\
					api.sell(lastPrice,1);iterator=pauseLength;isBuyed = false;\
					summ+=lastPrice-lastBuyPrice;\
					console.log('win:'+summ);\
				}\
			}\
		};	\
	};";

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