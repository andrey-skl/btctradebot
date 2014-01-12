
(function(){

	window.tradingController = function(trader, getTradeDataFn){
		this.trader =trader;
		this.status = "stopped";
		this.timerId = null;
		this.getData = getTradeDataFn;
		this.tradingData =[];
		this.flags=[];

		this.handleListeners = [];
		this.addSellBuyListeners(trader);
	}

	tradingController.prototype.start = function(timeFrameSeconds){
		timeFrameSeconds = timeFrameSeconds || 3600;
		var self = this;
		var intervalHandler = function(){
			self.getData(timeFrameSeconds).then(function(res){
				self.tradingData = res;
				self.trader.handleNewPeriod(res);
				self.callAllListeners(self.handleListeners, [self.trader, res]);
			});
		};

		this.timerId = setInterval(intervalHandler, timeFrameSeconds*1000);

		intervalHandler();

		this.status = tradingController.statuses.trading;
	}

	tradingController.prototype.stop = function(){
		clearInterval(this.timerId);
		this.status = tradingController.statuses.stopped;
	}

	tradingController.prototype.isTrading = function(){
		return this.status == tradingController.statuses.trading;
	}

	tradingController.prototype.addHandleListener = function(fn, optionalName){
		if (optionalName){
			this.handleListeners[optionalName] = fn;
		}else{
			typeof fn == "function" && this.handleListeners.push(fn);
		}
	}

	tradingController.prototype.callAllListeners = function(listeners, args){
		for (var i in listeners){
				listeners[i].apply(this, args);
		}
	}

	tradingController.prototype.addSellBuyListeners = function(trader){
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

	tradingController.statuses = {
		stopped: "stopped",
		trading: "trading",
	}

})();

