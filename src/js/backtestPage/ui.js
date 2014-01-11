
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

	showInLog: function(msg){
    	$("#logtext").text($("#logtext").text()+"\r\n"+msg);
    },

	
	makeCharts : function(data, flags, lines){
		var ohlc = [],
			volume = [],
			dataLength = data.length;
			
		for (i = 0; i < dataLength; i++) {
			ohlc.push([
				data[i].date.getTime(), // the date
				data[i].open, // open
				data[i].max, // high
				data[i].min, // low
				data[i].close // close
			]);
			
			volume.push([
				data[i].date.getTime(), // the date
				data[i].volume // the volume
			])
		}
		var series =[{
				name : 'BTC',
				type: 'candlestick',
				data : ohlc,
				id : 'quote',
				tooltip: {
					valueDecimals: 2
				}
			},{
				type : 'flags',
				data : flags,
				onSeries : 'quote',
				shape : 'circlepin',
				width : 16
			}, {
		        type: 'column',
		        name: 'Volume',
		        data: volume,
		        yAxis: 1,
		    }];

		for (var i in lines){
			series.push({
				name:i,
				data: lines[i]
			})
		}

		// create the chart
		$('#container').highcharts('StockChart', {
		    rangeSelector : {
				buttons : [{
					type : 'hour',
					count : 1,
					text : '1h'
				}, {
					type : 'day',
					count : 1,
					text : '1D'
				}, {
					type : 'all',
					count : 1,
					text : 'All'
				}],
				selected : 3,
				inputEnabled : true
			},
			yAxis: [{
		        title: {
		            text: 'Trading'
		        },
		        height: 200,
		        lineWidth: 2
		    }, {
		        title: {
		            text: 'Volume'
		        },
		        top: 300,
		        height: 100,
		        offset: 0,
		        lineWidth: 2
		    }],
			series : series,
		    title: {
		        text: 'BTC/USD'
		    },
		});
	},

}