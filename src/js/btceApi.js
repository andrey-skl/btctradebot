/*BTC-E api library
  Dont forget to include jQuery*/


//options should contain Key param
var btceAPI = function (options) {
    this.hostUrl = "https://btc-e.com";
	this.nonce = 0;
	this.fee=0.002;
	this.apiPath = "/tapi";
	
	jQuery.extend(this, options);

	this.setAuthHeaders();
};

btceAPI.constant = {
	BTCUSD : "btc_usd",
}

btceAPI.prototype.makeSign = function(data, key){
	var sign = CryptoJS.HmacSHA512(data, key).toString();
	return sign;
}


btceAPI.prototype.setAuthHeaders = function(){
	var self = this;
	jQuery.ajaxSetup({
	        beforeSend: function (xhr) {
	            if (self.key == undefined || self.secret == undefined)
	                throw "keys is empty";
	            xhr.setRequestHeader("Key", self.key);
	            xhr.setRequestHeader("Sign", self.makeSign(this.data, self.secret) );
	            return xhr;
	        }
	});
}

btceAPI.prototype.request = function(method, params){
	var self = this;
	params = params || {};
	params.method=method;
	params.nonce = ++self.nonce;

	var defer = $.Deferred();

	$.ajax({
	  url: self.hostUrl+self.apiPath,
	  cache: false,
	  dataType: 'json',
	  type: 'POST',
	  data: params,
	  success : function(res, textStatus, xhr) {
	  	if (res.success===0){
	  		//processing wrong nonce number provided error. Trying again
	  		if (res.error.indexOf("invalid nonce parameter")!=-1){
	  			self.nonce = parseInt(res.error.match(/\d+/ig)[0]);
	  			self.request(method, params).then(function(res){
	  				defer.resolve(res);
	  			})
	  		} else{
	  			defer.reject(res);
	  		}

	  	} else{
	  		defer.resolve(res.return);
	  	}
	  }, 
	  error: function(xhr, textStatus){
	  	defer.reject(xhr);
	  }
	});

	return defer.promise();
};

btceAPI.prototype.sellRequest =  function(pair, rate, amount){
	return this.request("Trade",{
		pair: pair, 
		type: "sell",
		rate: rate,
		amount: amount,
	});
}

btceAPI.prototype.buyRequest =  function(pair, rate, amount){
	return this.request("Trade",{
		pair: pair, 
		type: "buy",
		rate: rate,
		amount: amount,
	});
}

btceAPI.prototype.cancelOrder = function(order_id){
	return this.request("CancelOrder",{
		order_id: order_id,
	});
}

btceAPI.prototype.getActiveOrders = function(pair){
	return this.request("ActiveOrders",{
		pair: pair,
	});
}

//Open btc-e api to get ticker
btceAPI.prototype.tickerBTCUSD = function(){
	return $.getJSON("https://btc-e.com/api/2/btc_usd/ticker");
}

btceAPI.prototype.tradesBTCUSD = function(){
	return $.getJSON("https://btc-e.com/api/2/btc_usd/trades");
}
btceAPI.prototype.depthBTCUSD = function(){
	return $.getJSON("https://btc-e.com/api/2/btc_usd/depth");
}
