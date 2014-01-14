
(function(){

	window.tradeCore = function(api, strategySrc){
		var self = this;
		this.timeFrame = 3600;

		//strategySrcCode should create strategyProcessor object, constructor argument is API with standart trade interface
		//which can contains init method and should contains handlePeriod(tradeData) method
		//strategy can use TA-js lib
		eval(strategySrc);

		self.api = api;

		self.lastDate = null;
		self.buyListeners = [];
		self.sellListeners = [];
		self.cancelListeners = [];
		self.graphs = {};

		var apiHandler = new apiCallsHandler(self);

		self.signalProcessor = new tradingSignalProcessor(self, apiHandler);

		self.strategy = new strategyProcessor(apiHandler, self)
		
		if (typeof self.strategy.init == "function"){
			self.strategy.init();
		}
	}

	tradeCore.prototype.handleNewPeriod = function(tradeData){
		if (typeof this.strategy.handlePeriod == "function"){
			this.lastDate = tradeData[tradeData.length-1].date;
			return this.strategy.handlePeriod(tradeData);
		} else
			throw "Strategy dont implement handlePeriod method";		
	}

	tradeCore.prototype.callAllListeners = function(listeners, args){
		for (var i in listeners){
			if (typeof listeners[i] == "function"){
				listeners[i].apply(this, args);
			}
		}
	}

	tradeCore.prototype.addChart = function(name){
		this.graphs[name] = [];
		return this.graphs[name];
	}

	tradeCore.prototype.buySignal = function(recommendRate){
		return this.signalProcessor.processBuySignal(recommendRate);
	}

	tradeCore.prototype.sellSignal = function(recommendRate){
		return this.signalProcessor.processSellSignal(recommendRate);
	}

	tradeCore.prototype.addBuyListener = function(fn){
		this.buyListeners.push(fn);
	}
	tradeCore.prototype.addSellListener = function(fn){
		this.sellListeners.push(fn);
	}
	tradeCore.prototype.addCancelListener = function(fn){
		this.cancelListeners.push(fn);
	}
})();

