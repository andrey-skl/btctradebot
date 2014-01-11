
(function(){

	//this object handles api calls to insert listeners call
	var apiCallsHandler = function(trader){
		this.buy = function(rate, amount){
			trader.callAllListeners(trader.buyListeners, [rate, amount]);
			return trader.api.buy(rate, amount);
		};
		this.sell = function(rate, amount){
			trader.callAllListeners(trader.sellListeners, [rate, amount]);
			return trader.api.sell(rate, amount);
		};
		this.activeOrders = function(){
			return trader.api.activeOrders();
		};
		this.cancel = function(order_id){
			trader.callAllListeners(trader.cancelListeners, [order_id]);
			return trader.api.cancelOrder(order_id);
		};
	}

	window.tradeCore = function(api, strategySrc){
		var self = this;

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

		self.strategy = new strategyProcessor(new apiCallsHandler(self), self)
		
		if (typeof self.strategy.init == "function"){
			self.strategy.init();
		}
	}

	tradeCore.prototype.handleNewPeriod = function(tradeData){
		if (typeof this.strategy.handlePeriod == "function"){
			this.lastDate = tradeData[tradeData.length-1].date;
			this.strategy.handlePeriod(tradeData);
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

