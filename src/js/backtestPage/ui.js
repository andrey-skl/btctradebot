
var pageUi = {
	init: function(){
	    this.editor = ace.edit("editor");
	    this.editor.setTheme("ace/theme/clouds");
	    this.editor.getSession().setMode("ace/mode/javascript");
	    
	    this.selectedStrategyName = null;
	    this.selectedStrategySrc = null;

	    this.strategyUiInit(this.editor);
	    this.controlUiInit();
	},

	strategyUiInit: function(editor){
		var self = this;
		var strategies = strategyStorage.load();

		var currentStrategyName = strategyStorage.getSelected();
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
			editor.setValue(strategies[name]);
			editor.clearSelection();
			strategyStorage.setSelected(name);
			self.onStrategyChanged(name, strategies[name]);
		}

		setCurrentStrategy(currentStrategyName);

		$(".iSelectStrategy").off("click").on("click", function(e){
			var strName = $(this).html();
			setCurrentStrategy(strName);
		})

		$("#saveStrategy").off("click").on("click", function(e){
	    	var strategySrc = editor.getValue();
	    	var name = currentStrategyName = prompt("Please name your strategy", currentStrategyName);
	    	if (name){
	    		strategies = strategyStorage.save(name, strategySrc);
	    		setCurrentStrategy(name);
	    		appendToList(name);
	    	}
	    });

		$("#newStrategy").off("click").on("click", function(e){
	    	editor.setValue("");
	    });

	    $("#removeStrategy").off("click").on("click", function(e){
	    	if (strategies.length==1)
	    		return;
	    	strategies = strategyStorage.remove(currentStrategyName);
	    	$list.find("a[data-name='"+currentStrategyName+"']").remove();
	    	setCurrentStrategy(getFirstName());
	    });
	},

	controlUiInit: function(){
		var self = this;

		$("#testSelectedStrategy").on("click", function(e){
			var testingController = new testingControl();
			self.clearLog();
			//todo: replace back.table to dynamic datasource
			testingController.testStrategy(back.table, self.selectedStrategySrc);
		});

		var isChartHidden = false;
		var $showHideChartButton = $("#showHideCharts");
		$showHideChartButton.on("click", function(e){
			isChartHidden = ! isChartHidden;
			$("#showHideChartsText").text(isChartHidden ? "Show charts" : "Hide charts");
			if (isChartHidden) {
				$("#container").hide();
			} else {
				$("#container").show();	
			}
		})
	},

	onStrategyChanged: function(name, src){
		this.selectedStrategyName = name;
		this.selectedStrategySrc = src;

	},

	clearLog: function(){
		$("#logtext").empty();
	},
	showInLog: function(msg){
    	$("#logtext").text($("#logtext").text()+"\r\n"+msg);
    },

}