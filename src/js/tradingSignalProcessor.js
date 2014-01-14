(function(){
	window.tradingSignalProcessor = function(trader, apiInterface){
		this.trader = trader;
		this.apiInterface = apiInterface;
		this.initStatus(trader.api);
		this.isBought = false;
	};

	tradingSignalProcessor.prototype.initStatus = function(api){
		var self = this;
		api.status().then(function(status){
			boughtUsdEqual = status.last * status.balance.btc;
			self.isBought = boughtUsdEqual > status.balance.usd;
		});
	};

	tradingSignalProcessor.prototype.processBuySignal = function(recommendRate){
		var defer = $.Deferred();
		if (!this.isBought){
			this.isBought = true;
			return this.apiInterface.buyAllByMinRate(recommendRate);
		}
		defer.reject("already bought");
		return defer.promise();
	};

	tradingSignalProcessor.prototype.processSellSignal = function(recommendRate){
		var defer = $.Deferred();
		if (this.isBought){
			this.isBought = false;
			return this.apiInterface.sellAllByMaxRate(recommendRate)
		}
		defer.reject("already selled");
		return defer.promise();
	};

})();