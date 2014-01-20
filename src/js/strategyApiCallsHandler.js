//this object handles api calls to insert listeners call
window.apiCallsHandler = function(trader){
	this.buy = function(rate, amount){
		return trader.api.buy(rate, amount).then(function(res){
			trader.callAllListeners(trader.buyListeners, [rate, amount]);
		}, function(res){
			trader.callAllListeners(trader.cancelListeners, [res, "cant buy"]);
		});
	};
	this.buyAllByMinRate = function(recommendRate){
		var self = this;
		var defer = $.Deferred();
		trader.api.status().then(function(status){
			var last = status.last||recommendRate;
			var amount = status.balance.usd / last;
			amount = amount.toFixed(7); //округляем
			self.buy(last, amount).then(function(res){
				defer.resolve(res);
			});
		});
		return defer.promise();
	},
	this.sellAllByMaxRate = function(recommendRate){
		var self = this;
		var defer = $.Deferred();
		trader.api.status().then(function(status){
			amount = status.balance.btc;
			amount = amount.toFixed(7); //округляем
			self.sell(status.last||recommendRate, amount ).then(function(res){
				defer.resolve(res);
			});
		});
		return defer.promise();
	},
	this.sell = function(rate, amount){
		return trader.api.sell(rate, amount).then(function(res){
			trader.callAllListeners(trader.sellListeners, [rate, amount]);
		}, function(res){
			trader.callAllListeners(trader.cancelListeners, [res, "cant sell"]);
		});
	};
	this.activeOrders = function(){
		return trader.api.activeOrders();
	};
	this.cancel = function(order_id){
		trader.callAllListeners(trader.cancelListeners, [order_id]);
		return trader.api.cancelOrder(order_id);
	};
}