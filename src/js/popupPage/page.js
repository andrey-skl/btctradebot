var back = chrome.extension.getBackgroundPage();

$(function(){
	var updateStatus = function(test){
		var status = back.tradeController ? back.tradeController.status : "stopped";
		var selectedStrategy = localStorage.selectedTradingStrategy || "none";
		$("#status").text(status + ", selected strategy: "+selectedStrategy);
	};

	updateStatus();

	$("#openControlPanel").on('click', function(e){
		chrome.tabs.create({url: "html/controlPanel.html"});
	});

	$("#openBacktesting").on('click', function(e){
		chrome.tabs.create({url: "html/backTesting.html"});
	});

	back.api.status().then(function(s){
		$("#lastPrice").text(s.last);
		$("#btcCount").text(s.balance.btc);
		$("#usdCount").text(s.balance.usd);
		$("#usdEqualsCount").text((s.balance.usd + s.balance.btc * s.last).toFixed(4));
	});
})