(function(){
	window.payApi = function(){
		this.apiUrl = "http://btc-tradebot.heroku.com";
	}

	payApi.prototype.isBought = function(){
		var self = this;
		chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
			var url = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + token;
			$.get(url).then(function(d){

				$.get(self+"/isbought?email="d.email)then(function(d){
					return d.bought;
				});
				
			})
		});
	}
})()