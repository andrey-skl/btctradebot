
var back = chrome.extension.getBackgroundPage();

$(function() {
	pageUi.init();

    window.log.onNewMessage = function(logItem){
    	pageUi.showInLog(logItem.msg)
    }

    pageUi.makeCharts(back.table);
/*
    var loadStrategy = function(){
    	return localStorage.strategy;
    }

	var strategy = loadStrategy();

	pageUi.editor.setValue(strategy);

	var trader = new tradeCore(new fakeAPI(), strategy);

	var flags = [];

	var lastBuyPrice = 0;
	var summ = 0;
	trader.addBuyListener(function(rate, amount){
		console.log("buyed",rate, amount, this.lastDate);
		lastBuyPrice=rate;
		var dateString = this.lastDate.toLocaleDateString()+" "+this.lastDate.toLocaleTimeString();
		log(dateString+" buyed by "+rate);
		flags.push({
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
		flags.push({
			x: this.lastDate.getTime(),
			title:"S",
		});
	});

	var tester = new backTester(back.table, trader);
	console.log("Start backtest trading...");
	tester.test();

	pageUi.makeCharts(back.table, flags, trader.graphs);
*/

});