var btceApi = new btceAPI({
	key: "TBESLB4S-3ZKGN7TR-XGCCOVG7-LW0IOYL6-LHOCSP3I",
	secret: "4dd88305e97a4a80ff95b77101af1980f5905e918ecdbeb7bea3e779c64489a7",
	nonce:3,
});

btceApi.setAuthHeaders();

btceApi.request("getInfo").then(function(res){
	console.log(res);
});

