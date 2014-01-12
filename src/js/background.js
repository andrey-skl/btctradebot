
window.api = new btceAPI({
	key: localStorage.apiKey,
	secret: localStorage.secret,
});

api.request("getInfo").then(function(res){
	log("Your info:",res);
});

chrome.browserAction.onClicked.addListener(function (tab){
	//chrome.tabs.create({url: "html/backTesting.html"});
	chrome.tabs.create({url: "html/controlPanel.html"});
});

window.tradeController = null;

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if (request.message == "startTrading"){
		var trader = new tradeCore(api, request.selectedStrategySrc);
		tradeController = new tradingController(trader, bitcoinwisdomApi.getBtceBtcUsdChart);

		sendResponse(tradeController);

		tradeController.start(60);
	}
	if (request.message == "stopTrading"){

		sendResponse(tradeController);
		tradeController.stop();
	}
});
