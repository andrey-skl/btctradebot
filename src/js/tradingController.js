
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
		var interval = timeFrameSeconds*1000;
		var lastTimeFired = 0;
		var lastDateLoaded = null;
		var self = this;
		var intervalHandler = function(){
			var timeSpan = new Date() - lastTimeFired;

			if (timeSpan >= interval){

				self.getData(timeFrameSeconds, true).then(function(res){
					var newData = self.getUnprocessedPeriod(res, lastDateLoaded);

					if (newData.length){
						if (self.tradingData.length>0)
						{
							self.tradingData.push.apply(self.tradingData, newData);
						} else {
							self.tradingData = res;
						}
						self.trader.handleNewPeriod(res);
						self.callAllListeners(self.handleListeners, [self.trader, res]);
						lastDateLoaded = res[res.length-1].date.getTime();

						lastTimeFired = new Date();
					} else {
						console.warn("Last date loaded is same. Repeating");
					}

				});
			}
		};

		this.timerId = setInterval(intervalHandler, 3000);

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

			log(" buyed "+amount+" by "+rate,{
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

			log(" selled "+amount+" by "+rate+". win is "+win,{
				date: this.lastDate,
				additional: "summ="+summ,
			}, win>0 ? "success" : "warning");

			self.flags.push({
				x: this.lastDate.getTime(),
				title:"S",
			});
		});
	}

	tradingController.prototype.getUnprocessedPeriod = function(tradingData, lastTimeStamp){
		return _.filter(tradingData, function(t){
			return t.date.getTime() > lastTimeStamp;
		});
	}

	tradingController.statuses = {
		stopped: "stopped",
		trading: "trading",
	}
})();

