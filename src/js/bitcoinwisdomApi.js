/*bitcoinwisdom API
  Dont forget to include jQuery*/
(function(){
	var DATE_INDEX = 0;
	var OPEN_INDEX = 3;
	var CLOSE_INDEX = 4;
	var MAX_INDEX = 5;
	var MIN_INDEX = 6;
	var VOLUME_INDEX = 7;

	window.bitcoinwisdomApi = {
		getRawBtceBtcUsdChart : function(step){
			step=step || 3600;
			//returns chart array like
			//[[1389276000,26434758,26451647,788.99,801.001,810,783.503,1893.1854368199847],..]
			//where 0:unix time, 1:?, 2:?, 3: open, 4:close, 5:max, 6:min, 7:volume
			return $.getJSON("http://s2.bitcoinwisdom.com:8080/period?step="+step+"&symbol=btcebtcusd&mode=simple");
		},
		parseRawChart: function(rawData){
			var res = [];
			for(var i in rawData){
				var row = rawData[i];
				res.push({
					date : new Date(row[DATE_INDEX]*1000),
					open: row[OPEN_INDEX],
					close: row[CLOSE_INDEX],
					min: row[MIN_INDEX],
					max: row[MAX_INDEX],
					volume: row[VOLUME_INDEX],
				})
			}
			return res;
		},
		getBtceBtcUsdChart: function(step){
			var defer = $.Deferred();
			bitcoinwisdomApi.getRawBtceBtcUsdChart().then(function(res){
				defer.resolve(bitcoinwisdomApi.parseRawChart(res));
			}, function(res){
				defer.reject(res);
			});
			return defer.promise();
		},
	};

})();


