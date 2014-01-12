var back = chrome.extension.getBackgroundPage();

$(function(){
	var load = function(){
		var key = localStorage.apiKey;
		var secret = localStorage.secret;

		$("#key").val(key);
		$("#secret").val(secret);
	}

	load();

	var save = function(key, secret){
		localStorage.apiKey = key;
		localStorage.secret = secret;
		//TODO: notificate about saving
	}

	$("#save").on("click", function(e){
		save($("#key").val(), $("#secret").val())
	})

})