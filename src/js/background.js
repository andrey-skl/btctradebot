var settingsOpened = false;

var init = function(){
	window.api = new btceAPI({
		key: localStorage.apiKey,
		secret: localStorage.secret,
	});

	window.tradeController = null;

	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		if (request.message == "startTrading"){
			var trader = new tradeCore(api, request.selectedStrategySrc);
			tradeController = new tradingController(trader, bitcoinwisdomApi.getBtceBtcUsdChart);

			sendResponse(tradeController);

			tradeController.start(trader.timeFrame);
		}
		if (request.message == "stopTrading"){

			sendResponse(tradeController);
			tradeController.stop();
		}
	});
	log("extension initialized successfully.")
}

var checkAndInit = function(){
	var key = localStorage.apiKey, secret = localStorage.secret;

	if (!key || !secret){
		if (!settingsOpened){
			chrome.tabs.create({url: "html/settings.html"});
			settingsOpened = true;
		}
		setTimeout(checkAndInit, 1000);
	} else {
		init();
	}
}

checkAndInit();


 window.onerror = function (e, url, line) {
    log(e +" in "+ url + ":"+line,null,"error");
}
