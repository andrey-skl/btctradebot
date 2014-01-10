
btceAPI.prototype.status = function(){
	var defer = $.Deferred();
	btceApi.request("getInfo").then(function(res){
		btceApi.tickerBTCUSD().then(function(status){
			defer.resolve({
				balance: res.funds,
				last: status.last,
			});
		});
	});

	return defer.promise();
}

btceAPI.prototype.activeOrders = function(){
	return btceApi.getActiveOrders(btceAPI.constant.BTCUSD).then(function(res){
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
	return btceApi.sellRequest(btceAPI.constant.BTCUSD, rate, amount).then(function(res){
		return res.order_id;
	});
}

btceAPI.prototype.buy = function(rate, amount){
	return btceApi.buyRequest(btceAPI.constant.BTCUSD, rate, amount).then(function(res){
		return res.order_id;
	});
}

btceAPI.prototype.cancel = function(order_id){
	return btceApi.cancelOrder(order_id);
}
