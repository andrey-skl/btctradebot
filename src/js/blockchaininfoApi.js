/*blockchain.info api
  Dont forget to include jQuery*/
(function(){
	var DATE_INDEX = 0;
	var OPEN_INDEX = 3;
	var CLOSE_INDEX = 4;
	var MAX_INDEX = 5;
	var MIN_INDEX = 6;
	var VOLUME_INDEX = 7;

	window.blockchaininfoApi = {
		getRawBtceBtcUsdChart : function(){
			return $.getJSON("https://blockchain.info/charts/market-price?showDataPoints=false&timespan=60days&show_header=true&daysAverageString=1&scale=0&format=json");
		},
		parseRawChart: function(rawData){
			var res = [];
			for(var i in rawData){
				var row = rawData[i];
				res.push({
					date : new Date(row.x*1000),
					open: row.y,
					close: row.y,
					min: row.y,
					max: row.y,
					volume: row.y,
				})
			}
			return res;
		},
		getBtceBtcUsdChart: function(step){
			var defer = $.Deferred();
			this.getRawBtceBtcUsdChart(step).then(function(res){
				defer.resolve(blockchaininfoApi.parseRawChart(res.values));
			}, function(res){
				defer.reject(res);
			});
			return defer.promise();
		},
	};

})();


