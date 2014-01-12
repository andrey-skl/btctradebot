
var back = chrome.extension.getBackgroundPage();
window.log = back.log;

$(function() {

	pageUi.init();

    log.onNewMessage(function(logItem){
    	pageUi.showInLog(logItem.msg);
    });



});