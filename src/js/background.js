
window.btceApi = new btceAPI({
	key: localStorage.apiKey,
	secret: localStorage.secret,
});

btceApi.request("getInfo").then(function(res){
	log("Your info:",res);
});

btceApi.tickerBTCUSD().then(function(res){
	log("Situation:",res.ticker);
})

bitcoinwisdomApi.getBtceBtcUsdChart(3600).then(function(res){
	console.log("data loaded");

	window.table = res;
});



chrome.browserAction.onClicked.addListener(function (tab){
	chrome.tabs.create({url: "html/chart.html"});
});
