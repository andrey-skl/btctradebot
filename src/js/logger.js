
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

	logs = loadFromLocalStorage();

	window.log = function(msg, obj, category, type){
		var logItem = {
			msg: msg,
			obj: obj,
			category: category ? category : "general",
			type: type,
		};

		logs.push(logItem);

		saveToLocalStorage(logs);

		console.log(logItem)

		if (typeof log.onNewMessage == "function")
		{
			log.onNewMessage(logItem)
		}
	}

	log.onNewMessage = function(){};

})();

