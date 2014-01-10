(function() {
    describe('Testing backtesting functionality', function(){

        beforeEach(function(){

        });
		
		var fakeApi = {
			buy: function(){},
			sell: function(){},
			activeOrders: function(){},
			cancelOrder: function(){},
		}

        it('testing backtester call trader', function() {
        	var handleCalled = false;
        	var data = ["test"];
        	var fakeTrader = {
        		handleNewPeriod: function(d){
        			handleCalled = true;
        		},
        	};

			var tester = new backTester(data, fakeTrader);
			tester.test();

			expect(handleCalled).toBeTruthy();
        });

    }) ;
})();
