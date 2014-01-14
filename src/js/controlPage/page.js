
var back = chrome.extension.getBackgroundPage();
window.log = back.log;

$(function() {

	pageUi.init();

    log.onNewMessage(function(logItem){
    	pageUi.showInLog(logItem);
    });



});


window.onerror = function (e, url, line) {
    log(e +" in "+ url + ":"+line,null,"error");
}