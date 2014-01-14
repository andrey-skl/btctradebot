
var back = chrome.extension.getBackgroundPage();

$(function() {

	back.bitcoinwisdomApi.getBtceBtcUsdChart(3600).then(function(res){
		console.log("data loaded");

		window.table = res;

    	chartsUi.makeCharts(table);
	});

	pageUi.init();

    window.log.onNewMessage(function(logItem){
    	pageUi.showInLog(logItem)
    });



});