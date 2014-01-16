var testingControl = function(){
	this.flags = [];
}

testingControl.prototype.testStrategy = function(getTableFn, testStrategy){
	var self = this;
	var fakeApi = new fakeAPI({btc:0, usd:1000});
	
	var trader = new tradeCore(fakeApi, testStrategy);

	self.addListeners(trader);

	log("Loading trading data...");
	getTableFn(trader.timeFrame, false).then(function(data){
		var tester = new backTester(data, trader);
		log("Start backtest trading. Start balance: BTC="+fakeApi.fakeBalance.btc+", USD="+
			fakeApi.fakeBalance.usd+", equal "+self.getUSDequivalent(fakeApi.fakeBalance, data[data.length-1].close));

		tester.test().then(function(){
			log("Finish backtesting. End balance: BTC="+fakeApi.fakeBalance.btc+", USD="+fakeApi.fakeBalance.usd+
			", equal "+self.getUSDequivalent(fakeApi.fakeBalance, data[data.length-1].close))

			chartsUi.makeCharts(data, self.flags, trader.graphs);
		});

	})
}

testingControl.prototype.getUSDequivalent = function(balance, lastAmount){
	return balance.usd + balance.btc*lastAmount;
}

testingControl.prototype.addListeners = function(trader){
	var self = this;
	var lastBuyPrice = 0;
	var summ = 0;

	trader.addBuyListener(function(rate, amount){
		lastBuyPrice=rate;

		log(" bought "+amount+" by "+rate,{
			date: this.lastDate,
			additional: "rate="+rate,
		}, "info");

		self.flags.push({
			x: this.lastDate.getTime(),
			title:"B",
		});
	});

	trader.addSellListener(function(rate, amount){
		var win = rate-lastBuyPrice;
		summ+=win;
		log(" selled "+amount+" by "+rate+". win is "+win+". total summ = " +summ,{
			date: this.lastDate,
			additional: "summ="+summ,
		}, win>0 ? "success" : "warning");
		self.flags.push({
			x: this.lastDate.getTime(),
			title:"S",
		});
	});
}