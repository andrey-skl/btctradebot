var testingControl = function(){
	this.flags = [];
}

testingControl.prototype.testStrategy = function(data, testStrategy){
	var trader = new tradeCore(new fakeAPI(), testStrategy);

	this.addListeners(trader);

	var tester = new backTester(back.table, trader);
	console.log("Start backtest trading...");
	
	tester.test();

	pageUi.makeCharts(back.table, this.flags, trader.graphs);
}

testingControl.prototype.addListeners = function(trader){
	var self = this;
	var lastBuyPrice = 0;
	var summ = 0;

	trader.addBuyListener(function(rate, amount){
		console.log("buyed",rate, amount, this.lastDate);
		lastBuyPrice=rate;
		var dateString = this.lastDate.toLocaleDateString()+" "+this.lastDate.toLocaleTimeString();
		log(dateString+" buyed by "+rate);
		self.flags.push({
			x: this.lastDate.getTime(),
			title:"B",
		});
	});

	trader.addSellListener(function(rate, amount){
		console.log("selled",rate, amount);
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