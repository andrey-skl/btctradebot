(function() {
    describe('Testing core trade object', function(){

        beforeEach(function(){

        });
		
		var fakeApi = {
			buy: function(){},
			sell: function(){},
			activeOrders: function(){},
			cancelOrder: function(){},
		}

        it('Testing buy, sell and cancel listeners', function($rootScope, $controller) {
		
			var strategy = "\
				var strategyProcessor = function(api){\
					this.init = function(){};\
					this.handlePeriod = function(data){\
						api.buy(1,1);\
						api.sell(1,1);\
						api.cancel(1,1);\
					};\
				};\
			";
		
			var buyCalled = false;
			var sellCalled = false;
			var cancelCalled = false;
		
			var tr = new tradeCore(fakeApi, strategy);
			
			tr.addBuyListener(function(){
				buyCalled = true;
			});
			
			tr.addSellListener(function(){
				sellCalled = true;
			});
			
			tr.addCancelListener(function(){
				cancelCalled = true;
			});
			
			tr.handleNewPeriod([]);
            expect(buyCalled).toBeTruthy();
			expect(sellCalled).toBeTruthy();
			expect(cancelCalled).toBeTruthy();
        });

		
		it('Testing init called', function($rootScope, $controller) {
		
			var strategy = "\
				var strategyProcessor = function(api){\
					this.init = function(){\
						this.initCalled=true;\
					};\
					this.handlePeriod = function(data){\
					};\
				};\
			";
		
			var tr = new tradeCore(fakeApi, strategy);
			
            expect(tr.strategy.initCalled).toBeTruthy();
        });
    }) ;
})();
