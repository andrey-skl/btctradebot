
btceAPI.prototype.status = function(){
	var self = this;
	var defer = $.Deferred();
	self.request("getInfo").then(function(res){
		self.tickerBTCUSD().then(function(status){
			defer.resolve({
				balance: res.funds,
				last: status.ticker.last,
			});
		});
	});

	return defer.promise();
}

btceAPI.prototype.activeOrders = function(){
	return this.getActiveOrders(btceAPI.constant.BTCUSD).then(function(res){
		var orders = [];
		for (var i in res){
			orders.push({
				id: i,
				amount: res[i].amount,
				rate: res[i].rate,
				type: res[i].type
			});
		}
		return orders;
	});
}

btceAPI.prototype.sell = function(rate, amount){
	return this.sellRequest(btceAPI.constant.BTCUSD, rate, amount).then(function(res){
		return res.order_id;
	});
}

btceAPI.prototype.buy = function(rate, amount){
	return this.buyRequest(btceAPI.constant.BTCUSD, rate, amount).then(function(res){
		return res.order_id;
	});
}

btceAPI.prototype.cancel = function(order_id){
	return this.cancelOrder(order_id);
}
