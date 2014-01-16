
window.fakeAPI = function(startBalance){
	this.fee =  0.002;
	this.fakeBalance = {
		btc: startBalance.btc || 0,
		usd: startBalance.usd || 1000,
	};
}


fakeAPI.prototype.status = function(){
	var defer = $.Deferred();
	defer.resolve({
		balance: this.fakeBalance,
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
	this.fakeBalance.btc -= amount;
	this.fakeBalance.usd += rate*amount + rate*amount*this.fee;
	defer.resolve("test_id");
	return defer.promise();
}

fakeAPI.prototype.buy = function(rate, amount){
	var defer = $.Deferred();
	this.fakeBalance.btc += amount;
	this.fakeBalance.usd -= (rate*amount + rate*amount*this.fee);
	defer.resolve("test_id");
	return defer.promise();
}

fakeAPI.prototype.cancel = function(order_id){
	var defer = $.Deferred();
	defer.resolve();
	return defer.promise();
}
