(function(){
	window.payApi = function(){
		this.apiUrl = "http://btc-tradebot.herokuapp.com";
	}

	payApi.prototype.isBought = function(){
		var self = this;
		var defer = $.Deferred();
		chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
			var url = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + token;
			$.get(url).then(function(d){

				$.get(self.apiUrl+"/isbought?email="+d.email).then(function(d){
					var data = JSON.parse(d);
					defer.resolve(data.bought);
				});
				
			})
		});
		return defer.promise();
	}
})()