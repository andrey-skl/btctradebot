
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

btceApi.tradesBTCUSD().then(function(res){

	for (var i in res){
		var row = res[i];
		row.date = new Date(row.date*1000).toTimeString();
	}

	console.table(res);
})

