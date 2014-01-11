
var strategyStorage = {
	load: function(){
		var strategies = localStorage.strategies ? JSON.parse(localStorage.strategies) : undefined;
		if (strategies == undefined)
		{
			strategies = {};
			localStorage.stragegiesCount=0;
		}
		return strategies;
	},
	save: function(name, strategySrc){
		var strategies = strategyStorage.load();
		strategies[name] = strategySrc;
		localStorage.stragegiesCount=localStorage.stragegiesCount++;
		localStorage.strategies = JSON.stringify(strategies);
		return strategies;
	},
	remove: function(name){
		var strategies = strategyStorage.load();
		if (strategies[name]){
			delete strategies[name];
			localStorage.stragegiesCount=localStorage.stragegiesCount--;
		}
		localStorage.strategies = JSON.stringify(strategies);
		return strategies;
	},
	setSelected: function(name){
		localStorage.selectedStrategy = name;
	},
	getSelected: function(){
		return localStorage.selectedStrategy;
	},
	count: function(){
		return localStorage.stragegiesCount;
	}
}


