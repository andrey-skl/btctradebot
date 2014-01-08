/*BTC-E api library
  Dont forget to include jQuery*/


//options should contain Key param
var btceAPI = function (options) {
    this.hostUrl = "https://btc-e.com";
	this.nonce = 0;
	this.apiPath = "/tapi";
	
	jQuery.extend(this, options);
};

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
	params = params || {};
	params.method=method;
	params.nonce = ++this.nonce;

	return $.ajax({
	  url: this.hostUrl+this.apiPath,
	  cache: false,
	  dataType: 'json',
	  type: 'POST',
	  data: params,
	});
};

