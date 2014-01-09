
var btceApi = new btceAPI({
	key: localStorage.apiKey,
	secret: localStorage.secret,
});

btceApi.request("getInfo").then(function(res){
	console.log("Your info:",res);
});

btceApi.tickerBTCUSD().then(function(res){
	console.log("Situation:",res.ticker);
})

bitcoinwisdomApi.getBtceBtcUsdChart().then(function(res){
	console.log("charts:");

	
	var closedPrices = [];
	for (var i in res){
		var row = res[i];
		row[0] = new Date(row[0]*1000);
		closedPrices.push(row[6]);
	}
	
	var ema = TA.EMAverage(closedPrices, 4)
	console.log(ema);

	window.table = res;
	window.ema = ema;
	
	console.table(res);
});

