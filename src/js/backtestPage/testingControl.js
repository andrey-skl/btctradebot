var testingControl = function(){
	this.flags = [];
}

testingControl.prototype.testStrategy = function(data, testStrategy){
	var fakeApi = new fakeAPI({btc:0, usd:1000});
	
	var trader = new tradeCore(fakeApi, testStrategy);

	this.addListeners(trader);

	var tester = new backTester(back.table, trader);
	log("Start backtest trading. Start balance: BTC="+fakeApi.fakeBalance.btc+", USD="+
		fakeApi.fakeBalance.usd+", equal "+this.getUSDequivalent(fakeApi.fakeBalance, back.table[back.table.length-1].close));
	
	tester.test();

	log("Finish backtesting. End balance: BTC="+fakeApi.fakeBalance.btc+", USD="+fakeApi.fakeBalance.usd+
		", equal "+this.getUSDequivalent(fakeApi.fakeBalance, back.table[back.table.length-1].close))

	pageUi.makeCharts(back.table, this.flags, trader.graphs);
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
		var dateString = this.lastDate.toLocaleDateString()+" "+this.lastDate.toLocaleTimeString();
		log(dateString+" buyed by "+rate);
		self.flags.push({
			x: this.lastDate.getTime(),
			title:"B",
		});
	});

	trader.addSellListener(function(rate, amount){
		var win = rate-lastBuyPrice;
		summ+=win;
		var dateString = this.lastDate.toLocaleDateString()+" "+this.lastDate.toLocaleTimeString();
		log(dateString+" selled by "+rate+". win is "+win+". total summ = " +summ);
		self.flags.push({
			x: this.lastDate.getTime(),
			title:"S",
		});
	});
}