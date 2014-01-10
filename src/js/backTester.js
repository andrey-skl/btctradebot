
(function(){

	window.backTester = function(tradeData, trader){
		this.tradeData =tradeData; 
		this.trader =trader;
	}

	backTester.prototype.test = function(){
		var data = [];
		for (var i in this.tradeData){
			var row = this.tradeData[i];
			data.push(row);
			this.trader.handleNewPeriod(data);
		}
	}

})();

