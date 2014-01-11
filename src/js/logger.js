
(function(){
	var logs = [];

	var saveToLocalStorage = function(logsArr){
		localStorage.logs = JSON.stringify(logsArr);
	};

	var loadFromLocalStorage = function(){
		var logsString = localStorage.logs;
		if (logsString==undefined)
			return[];
		return JSON.parse(logsString);
	};

	window.log = function(msg, obj, category, type){
		var logItem = {
			msg: msg,
			obj: obj,
			category: category ? category : "general",
			type: type,
		};

		logs.push(logItem);

		console.log(logItem.msg, logItem.obj);

		if (typeof log.onNewMessage == "function")
		{
			log.onNewMessage(logItem)
		}
	}

	log.onNewMessage = function(){};

})();

