
window.fakeAPI = function(){

}

fakeAPI.prototype.status = function(){
	var defer = $.Deferred();
	defer.resolve({
		balance: {
			btc: 0,
			usd: 1000
		},
		last: null,
	});
	return defer.promise();
}

fakeAPI.prototype.activeOrders = function(){
	var defer = $.Deferred();
	defer.resolve([]);
	return defer.promise();
}

fakeAPI.prototype.sell = function(rate, amount){
	var defer = $.Deferred();
	defer.resolve("test_id");
	return defer.promise();
}

fakeAPI.prototype.buy = function(rate, amount){
	var defer = $.Deferred();
	defer.resolve("test_id");
	return defer.promise();
}

fakeAPI.prototype.cancel = function(order_id){
	var defer = $.Deferred();
	defer.resolve();
	return defer.promise();
}
