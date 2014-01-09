/*bitcoinwisdom API
  Dont forget to include jQuery*/

var bitcoinwisdomApi = {
	getBtceBtcUsdChart : function(step){
		step=step || 3600;
		return $.getJSON("http://s2.bitcoinwisdom.com:8080/period?step="+step+"&symbol=btcebtcusd&mode=simple");
	},
};
