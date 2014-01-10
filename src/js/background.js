
var btceApi = new btceAPI({
	key: localStorage.apiKey,
	secret: localStorage.secret,
});

btceApi.request("getInfo").then(function(res){
	log("Your info:",res);
});

btceApi.tickerBTCUSD().then(function(res){
	log("Situation:",res.ticker);
})

bitcoinwisdomApi.getBtceBtcUsdChart(3600).then(function(res){
	console.log("data loaded");
	
	var closedPrices = [];
	for (var i in res){
		closedPrices.push(res[i].close);
	}

	window.table = res;
	window.ema = TA.EMAverage(closedPrices, 10);
	
	//console.table(res);


	var strategy = "\
	var strategyProcessor = function(api){\
		var pauseLength = 5;\
		var iterator = pauseLength;\
		var isBuyed = false;\
		var summ = 0;\
		var lastBuyPrice = 0;\
		var stopLoss = 10;\
		var takeProfit = 40;\
		this.handlePeriod= function(tradeData){\
			if (iterator>0)\
				iterator--;\
			var lastPrice = tradeData[tradeData.length-1].close;\
			var closedPrices = [];\
			for (var i in tradeData){\
				closedPrices.push(tradeData[i].close);\
			}\
			var ema4 = TA.EMAverage(closedPrices, 3);\
			var ema8 = TA.EMAverage(closedPrices, 10);\
			/*var ROC = TA.Roc(closedPrices, 10);*/\
\
			var lastEmas = [];\
			/*filling last emas*/	\
			for (var i= ema4.length-8; i >=ema4.length-8-4; i-- ){\
				lastEmas.push({\
					ema4: ema4[i],\
					ema8: ema8[i]\
				});\
			}	\
			/*searching upper cross*/\
			for (var i = 1; i<lastEmas.length; i++){\
				var prevEmas = lastEmas[i-1];\
				var lastEma = lastEmas[i];\
				if (!prevEmas.ema4 || !prevEmas.ema8 || !lastEma.ema4 || !lastEma.ema8)\
					continue;\
				if (prevEmas.ema4 > prevEmas.ema8 && lastEma.ema4 < lastEma.ema8){\
					if (iterator==0 && !isBuyed) {\
						api.buy(lastPrice,1);iterator=pauseLength;isBuyed=true;\
						lastBuyPrice = lastPrice;\
					}\
				} else if (prevEmas.ema4 < prevEmas.ema8 && lastEma.ema4 > lastEma.ema8){\
					if (iterator==0 && isBuyed) {\
						api.sell(lastPrice,1);iterator=pauseLength;isBuyed = false;\
						summ+=lastPrice-lastBuyPrice;\
						console.log('win:'+summ);\
					}\
				}\
				/*var prevRoc = ROC[ROC.length-10-2];\
				var lastRoc = ROC[ROC.length-10-1];\
				if (lastRoc<0 && prevRoc>0){\
					if (iterator==0 && !isBuyed) {\
						api.buy(lastPrice,1);iterator=pauseLength;isBuyed=true;\
						lastBuyPrice = lastPrice;\
					}\
				} else if (lastRoc>0 && prevRoc<0){\
					if (iterator==0 && isBuyed) {\
						api.sell(lastPrice,1);iterator=pauseLength;isBuyed = false;\
						summ+=lastPrice-lastBuyPrice;\
						console.log('win:'+summ);\
					}\
				}*/\
				if (isBuyed && lastPrice<lastBuyPrice-stopLoss){\
					console.warn('stopLoss shouted!!!');\
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

	var trader = new tradeCore(btceApi, strategy);

	trader.addBuyListener(function(rate, amount){
		console.log("buyed",rate, amount);
	});
	trader.addSellListener(function(rate, amount){
		console.log("selled",rate, amount);
	});

	var tester = new backTester(res, trader);
	console.log("Start backtest trading...");
	tester.test();

});



chrome.browserAction.onClicked.addListener(function (tab){
	chrome.tabs.create({url: "html/chart.html"});
});
