
(function(){

	window.backTester = function(tradeData, trader){
		this.tradeData =tradeData; 
		this.trader =trader;
	}

	backTester.prototype.test = function(){
		var self = this;
		var defer = $.Deferred();
		var data = [];
		var i = 0;
		var len = this.tradeData.length;

		var processPeriod = function(){
			var row = self.tradeData[i];
			data.push(row);
			self.trader.handleNewPeriod(data);

			self.onPeriodHandled();
			i++;
			if (i<len){
				setTimeout(processPeriod, 1);
			} else {
				defer.resolve();
			}
		}

		processPeriod();

		return defer.promise();
	}
	backTester.prototype.onPeriodHandled = function(){

	}

})();

