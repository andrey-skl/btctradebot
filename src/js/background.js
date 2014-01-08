var btceApi = new btceAPI({
	key: "TBESLB4S-3ZKGN7TR-XGCCOVG7-LW0IOYL6-LHOCSP3I",
	secret: "YOURSECRET",
	nonce:3,
});

btceApi.setAuthHeaders();

btceApi.request("getInfo").then(function(res){
	console.log(res);
});

