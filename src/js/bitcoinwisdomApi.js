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
		getRawBtceBtcUsdChart : function(step, isSimple){
			step=step || 3600;
			//returns chart array like
			//[[1389276000,26434758,26451647,788.99,801.001,810,783.503,1893.1854368199847],..]
			//where 0:unix time, 1:?, 2:?, 3: open, 4:close, 5:max, 6:min, 7:volume
			var url = "https://s2.bitcoinwisdom.com/period?step="+step+"&symbol=btcebtcusd";
			if (isSimple) {
				url+="&mode=simple"
			}
			return fetch(url).then(res => res.json());
		},
		parseRawChart: function(rawData) {
			return rawData.map(row => ({
				date : new Date(row[DATE_INDEX]*1000),
				open: row[OPEN_INDEX],
				close: row[CLOSE_INDEX],
				low: row[MIN_INDEX],
				high: row[MAX_INDEX],
				volume: row[VOLUME_INDEX],		
			}));
		},
		getBtceBtcUsdChart: function(step, isSimple){
			return bitcoinwisdomApi.getRawBtceBtcUsdChart(step, isSimple)
				.then(res => bitcoinwisdomApi.parseRawChart(res));
		},
	};

})();


