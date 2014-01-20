
window.fakeAPI = function(startBalance){
	this.fee =  0.002;
	this.feeKoef = 1-this.fee;
	this.fakeBalance = {
		btc: startBalance.btc || 0,
		usd: startBalance.usd || 1000,
		getTotal : function(rate){
			return this.btc*rate + this.usd;
		}
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
	this.fakeBalance.usd += rate*amount*this.feeKoef;
	defer.resolve("test_id");
	return defer.promise();
}

fakeAPI.prototype.buy = function(rate, amount){
	var defer = $.Deferred();
	this.fakeBalance.btc += amount*this.feeKoef;
	this.fakeBalance.usd -= rate*amount;
	defer.resolve("test_id");
	return defer.promise();
}

fakeAPI.prototype.cancel = function(order_id){
	var defer = $.Deferred();
	defer.resolve();
	return defer.promise();
}
