
var pageUi = {
	init: function(){
	    this.selectedStrategyName = null;
	    this.selectedStrategySrc = null;

	    this.strategyUiInit();
	    this.controlUiInit();
	},

	strategyUiInit: function(){
		var self = this;
		var strategies = strategyStorage.load();

		var currentStrategyName = localStorage.selectedTradingStrategy;
		if (strategies[currentStrategyName]==undefined){
			currentStrategyName = null;
		}
		var $list = $("#strategylist");
		var appendToList = function(name){
			$list.append("<li><a href='javascript:void(0)' class='iSelectStrategy' data-name='"+name+"'>"+name+"</a></li>");
		}

		for (var i in strategies){
			if (!currentStrategyName) currentStrategyName = i;
			appendToList(i);
		}

		var getFirstName = function(obj){
			for (var i in strategies){
				return i;
			}
		}

		var setCurrentStrategy = function(name){
			if (!name) return;
			currentStrategyName = name;
			$(".iCurrentStrategyName").text(name);
			localStorage.selectedTradingStrategy = name;
			self.onStrategyChanged(name, strategies[name]);
		}

		setCurrentStrategy(currentStrategyName);

		$(".iSelectStrategy").off("click").on("click", function(e){
			var strName = $(this).html();
			setCurrentStrategy(strName);
		})
	},

	updateControlInterfaceDisabling : function(isTrading){
		if (isTrading){
			$("#strategySelector, #startTradging").addClass("disabled");
			$("#stopTrading").removeClass("disabled");
		} else {
			$("#strategySelector, #startTradging").removeClass("disabled");
			$("#stopTrading").addClass("disabled");
		}
	},

	controlUiInit: function(){
		var self = this;

		var firstListenerFired = true;

		var addHandleListeners = function(){
			back.tradeController.addHandleListener(function(trader, res){
				log("period handled at "+trader.lastDate+". now="+new Date());
				if (firstListenerFired){
					chartsUi.makeCharts(back.tradeController.tradingData, back.tradeController.flags, back.tradeController.trader.graphs);
					firstListenerFired = false;
				} else {
					chartsUi.addPeriod(back.tradeController.tradingData, this.flags, trader.graphs);
				}
			}, "controlPanelListener");

			back.tradeController.trader.addBuyListener(function(rate, amount){
				chartsUi.addFlag("B", this.lastDate.getTime());
			});

			back.tradeController.trader.addSellListener(function(rate, amount){
				chartsUi.addFlag("S", this.lastDate.getTime());
			});
		}

		if (back.tradeController && back.tradeController.isTrading()){
			//trading is in processing
			self.updateControlInterfaceDisabling(back.tradeController.isTrading());
			addHandleListeners();
			log.logs.map(function(logItem){
				self.showInLog(logItem.msg);
			})
			firstListenerFired = false;
			chartsUi.makeCharts(back.tradeController.tradingData, back.tradeController.flags, back.tradeController.trader.graphs);
		} else {
			
			back.bitcoinwisdomApi.getBtceBtcUsdChart(3600).then(function(res){
				console.log("data loaded");

				window.table = res;
				chartsUi.makeCharts(table);
			});
		}

		$("#startTradging").on("click", function(e){
			self.clearLog();

			chrome.extension.sendRequest(
				{
					message: "startTrading", 
					selectedStrategySrc: self.selectedStrategySrc
				}, 
				function callback(obj) {
					addHandleListeners();
					self.updateControlInterfaceDisabling(back.tradeController.isTrading());

					log("trading started.");
				}
			);
		});

		$("#stopTrading").on("click", function(e){
			chrome.extension.sendRequest(
				{
					message: "stopTrading", 
				}, 
				function callback(obj) {
					self.updateControlInterfaceDisabling(back.tradeController.isTrading());
					log("trading stopped.");
				}
			);
		});
	},

	onStrategyChanged: function(name, src){
		this.selectedStrategyName = name;
		this.selectedStrategySrc = src;
	},

	clearLog: function(){
		log.clear();
		$("#logtext").empty();
	},
	showInLog: function(msg){
    	$("#logtext").text($("#logtext").text()+"\r\n"+msg);
    },

}