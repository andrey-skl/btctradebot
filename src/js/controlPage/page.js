
var back = chrome.extension.getBackgroundPage();
window.log = back.log;

$(function() {

	pageUi.init();
});


window.onerror = function (e, url, line) {
    log(e +" in "+ url + ":"+line,null,"error");
}