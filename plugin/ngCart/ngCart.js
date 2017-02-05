'use strict';


angular.module('ngCart', ['ngCart.directives'])

    .config([function () {

    }])

    .provider('$ngCart', function () {
        this.$get = function () {
        };
    })

    .run(['$rootScope', 'ngCart', 'ngCartItem', 'store', function ($rootScope, ngCart, ngCartItem, store) {

        $rootScope.$on('ngCart:change', function () {
            ngCart.$save();
        });

        if (angular.isObject(store.get('cart'))) {
            ngCart.$restore(store.get('cart'));

        } else {
            ngCart.init();
        }

    }])

    .service('ngCart', ['$rootScope', 'ngCartItem', 'store', '$http', '$timeout', function ($rootScope, ngCartItem, store, $http, $timeout) {

        var urlServer = 'http://localhost/inventoryApp/server/';

        this.showdata = function () {
            // $rootScope.data = {}; 
            var loader = true;
            $http.get(urlServer + 'list.php?action=get')
                .success(function (data, status, headers, config) {
                    $timeout(function () {
                        $rootScope.loader = false;
                        $rootScope.data = data;
                        $rootScope.rowdata = $rootScope.data.length;
                        // $rootScope.$apply();
                    });
                }).error(function (data, status, headers, config) {
                    alert('gagal terhubung ke server');
                });

            $http.get(urlServer + 'list.php?action=get_base')
                .success(function (data, status, headers, config) {
                    $timeout(function () {
                        $rootScope.loader = false;
                        $rootScope.base = data;

                        // $rootScope.$apply();
                    });
                }).error(function (data, status, headers, config) {
                    alert('gagal terhubung ke server');
                });
        };

        this.init = function () {
            this.$cart = {
                shipping: null,
                taxRate: null,
                tax: null,
                bayar: 0,
                kembali: 0,
                items: []
            };
        };

        this.addItem = function (id, name, price, quantity, data) {

            var inCart = this.getItemById(id);

            if (typeof inCart === 'object') {
                //Update quantity of an item if it's already in the cart
                inCart.setQuantity(quantity, false);
            } else {
                var newItem = new ngCartItem(id, name, price, quantity, data);
                this.$cart.items.push(newItem);
                $rootScope.$broadcast('ngCart:itemAdded', newItem);
            }

            $rootScope.$broadcast('ngCart:change', {});
        };

        // this.inCart = function(){
        //     return  ngCart.getItemById(attrs.id);
        // };

        this.getItemById = function (itemId) {
            var items = this.getCart().items;
            var build = false;

            angular.forEach(items, function (item) {
                if (item.getId() === itemId) {
                    build = item;
                }
            });
            return build;
        };

        this.setShipping = function (shipping) {
            this.$cart.shipping = shipping;
            return this.getShipping();
        };

        this.getShipping = function () {
            if (this.getCart().items.length == 0) return 0;
            return this.getCart().shipping;
        };

        this.setTaxRate = function (taxRate) {
            this.$cart.taxRate = +parseFloat(taxRate).toFixed(2);
            return this.getTaxRate();
        };

        this.getTaxRate = function () {
            return this.$cart.taxRate
        };

        this.getTax = function () {
            return +parseFloat(((this.getSubTotal() / 100) * this.getCart().taxRate)).toFixed(2);
        };

        this.setCart = function (cart) {
            this.$cart = cart;
            return this.getCart();
        };

        this.getCart = function () {
            return this.$cart;
        };

        this.getItems = function () {
            return this.getCart().items;
        };

        this.getTotalItems = function () {
            var count = 0;
            var items = this.getItems();
            angular.forEach(items, function (item) {
                count += item.getQuantity();
            });
            return count;
        };

        this.getTotalUniqueItems = function () {
            return this.getCart().items.length;
        };

        this.getSubTotal = function () {
            var total = 0;
            angular.forEach(this.getCart().items, function (item) {
                total += item.getTotal();
            });
            return +parseFloat(total).toFixed(2);
        };

        this.totalCost = function () {
            return +parseFloat(this.getSubTotal() + this.getShipping() + this.getTax()).toFixed(2);
        };


        this.bayar = 0;


        this.kembali = function () {
            if ((this.bayar - this.totalCost()) <= 0) {
                return +parseFloat(0).toFixed(2);
            } else {
                return +parseFloat(this.bayar - this.totalCost()).toFixed(2);
            };
        };

        this.removeItem = function (index) {
            this.$cart.items.splice(index, 1);
            $rootScope.$broadcast('ngCart:itemRemoved', {});
            $rootScope.$broadcast('ngCart:change', {});

        };

        this.removeItemById = function (id) {
            var cart = this.getCart();
            angular.forEach(cart.items, function (item, index) {
                if (item.getId() === id) {
                    cart.items.splice(index, 1);
                }
            });
            this.setCart(cart);
            $rootScope.$broadcast('ngCart:itemRemoved', {});
            $rootScope.$broadcast('ngCart:change', {});
        };

        this.empty = function () {

            $rootScope.$broadcast('ngCart:change', {});
            this.$cart.items = [];
            localStorage.removeItem('cart');
        };

        this.isEmpty = function () {

            return (this.$cart.items.length > 0 ? false : true);

        };

        this.toObject = function () {

            if (this.getItems().length === 0) return false;

            var items = [];
            angular.forEach(this.getItems(), function (item) {
                items.push(item.toObject());
            });

            return {
                shipping: this.getShipping(),
                tax: this.getTax(),
                taxRate: this.getTaxRate(),
                subTotal: this.getSubTotal(),
                totalCost: this.totalCost(),
                bayar: this.bayar,
                kembali: this.kembali(),
                items: items
            }
        };


        this.$restore = function (storedCart) {
            var _self = this;
            _self.init();
            _self.$cart.shipping = storedCart.shipping;
            _self.$cart.tax = storedCart.tax;

            angular.forEach(storedCart.items, function (item) {
                _self.$cart.items.push(new ngCartItem(item._id, item._name, item._price, item._quantity, item._data));
            });
            this.$save();
        };

        this.$save = function () {
            return store.set('cart', JSON.stringify(this.getCart()));
        }

    }])

    .factory('ngCartItem', ['$rootScope', '$log', function ($rootScope, $log) {

        var item = function (id, name, price, quantity, data) {
            this.setId(id);
            this.setName(name);
            this.setPrice(price);
            this.setQuantity(quantity);
            this.setData(data);
        };


        item.prototype.setId = function (id) {
            if (id) this._id = id;
            else {
                $log.error('An ID must be provided');
            }
        };

        item.prototype.getId = function () {
            return this._id;
        };


        item.prototype.setName = function (name) {
            if (name) this._name = name;
            else {
                $log.error('A name must be provided');
            }
        };
        item.prototype.getName = function () {
            return this._name;
        };

        item.prototype.setPrice = function (price) {
            var priceFloat = parseFloat(price);
            if (priceFloat) {
                if (priceFloat <= 0) {
                    $log.error('A price must be over 0');
                } else {
                    this._price = (priceFloat);
                }
            } else {
                $log.error('A price must be provided');
            }
        };
        item.prototype.getPrice = function () {
            return this._price;
        };


        item.prototype.setQuantity = function (quantity, relative) {


            var quantityInt = parseInt(quantity);
            if (quantityInt % 1 === 0) {
                if (relative === true) {
                    this._quantity += quantityInt;
                } else {
                    this._quantity = quantityInt;
                }
                if (this._quantity < 1) this._quantity = 1;

            } else {
                this._quantity = 1;
                $log.info('Quantity must be an integer and was defaulted to 1');
            }
            $rootScope.$broadcast('ngCart:change', {});

        };

        item.prototype.getQuantity = function () {
            return this._quantity;
        };

        item.prototype.setData = function (data) {
            if (data) this._data = data;
        };

        item.prototype.getData = function () {
            if (this._data) return this._data;
            else $log.info('This item has no data');
        };


        item.prototype.getTotal = function () {
            return +parseFloat(this.getQuantity() * this.getPrice()).toFixed(2);
        };

        item.prototype.toObject = function () {
            return {
                id: this.getId(),
                name: this.getName(),
                price: this.getPrice(),
                quantity: this.getQuantity(),
                data: this.getData(),
                total: this.getTotal()
            }
        };

        return item;

    }])

    .service('store', ['$window', function ($window) {

        return {

            get: function (key) {
                if ($window.localStorage[key]) {
                    var cart = angular.fromJson($window.localStorage[key]);
                    return JSON.parse(cart);
                }
                return false;

            },


            set: function (key, val) {

                if (val === undefined) {
                    $window.localStorage.removeItem(key);
                } else {
                    $window.localStorage[key] = angular.toJson(val);
                }
                return $window.localStorage[key];
            }
        }
    }])

    .controller('CartController', ['$scope', 'ngCart', '$http', '$window', '$timeout', function ($scope, ngCart, $http, $window, $timeout) {

        $scope.ngCart = ngCart;
        $scope.bayar = ngCart.bayar;
        $scope.kembali = ngCart.kembali;
        $scope.selectedProdcuts = [];
        $scope.tempName = '';
        $scope.tempPrice = 0;
        $scope.tempQty = 0;
        $scope.grandTotal = 0;
        $scope.msg_prod = false;
        $scope.FirstName = '';
        $scope.LastName = '';
        $scope.MobileNo = '';
        $scope.BillDate = new Date().toLocaleString();
        $scope.paidBy = "Paid by Cash";
        $scope.base_selected = 0;
        $scope.discount_value = 0;
        $scope.PaymentType = 'Cash';
        $scope.bill_id = 0;
        


        var urlServer = 'http://localhost/inventoryApp/server/';
        $http.get(urlServer + 'list.php?action=get').success(function (data) {
            $scope.allProducts = data;
        });

        $scope.onSelect = function ($item, $model, $label, $index) {

            $scope.$item = $item;
            $scope.$model = $model;
            $scope.$label = $label;
            $scope.tempName = $scope.$item.nama_produk;
            $scope.tempPrice = $scope.$item.harga;
            $scope.tempQty = parseInt($scope.$item.stok);;
            $scope.selectedProdcuts[$index].price = $scope.$item.harga;
            $scope.selectedProdcuts[$index].quantity = 1;
            $scope.selectedProdcuts[$index].subTotal = parseFloat($scope.$item.harga * 1);
            $scope.selectedProdcuts[$index].id = $scope.$item.idproduk;
            $scope.selectedProdcuts[$index].base_selected = $scope.$item.idkategori;
            $scope.selectedProdcuts[$index].product_name = $scope.$item.nama_produk;

            $scope.totalCost();
        };
        $scope.add = function () {
            $scope.selectedProdcuts.push({
                'product': '',
                'price': 0.0,
                'quantity': 1,
                'subTotal': 0,
            });
            $scope.totalCost();
        }
        // $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

        $scope.noResults = false;
        $scope.product = '';
        $scope.selectedProdcuts = [{
            'product': '',
            'price': 0.0,
            'quantity': 1,
            'subTotal': 0,
        }];

        $scope.ClearAfterPrint = function () {
            if ($scope.product_error == false) {
                $scope.selectedProdcuts = [{
                    'product': '',
                    'price': 0.0,
                    'quantity': 1,
                    'subTotal': 0,
                }];
                $scope.totalCost();
                $scope.grandTotalOld = 0;
                $scope.discount_value = 0;
                $scope.FirstName = null;
                $scope.LastName = null;
                $scope.MobileNo = null;
                $scope.PaymentType = 'Cash';

            }
        }
        var myCallback = function () {
            var prtContent = document.getElementById("print");
            var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
            WinPrint.document.write(prtContent.innerHTML);
            WinPrint.document.close();
            WinPrint.focus();
            WinPrint.print();
            WinPrint.close();
            $scope.ClearAfterPrint();
        }
        	


 function getDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }   
    var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;   
     return dateTime;
}


        $scope.print = function () {
            $scope.product_error = false;
             $scope.BillDate = getDateTime();
            var temp = {};
            temp.data = {};
            temp.data.items = {};
            if (angular.isDefined($scope.selectedProdcuts.length) && $scope.selectedProdcuts.length > 0) {
                angular.forEach($scope.selectedProdcuts, function (value, key) {
                    if (value.product != '')
                        temp.data.items[key] = { 'id': value.id, 'quantity': value.quantity, 'base': value.base_selected, 'product_name_qty': value.product_name.replace(/[^\d.]/g, '') };
                    else
                        $scope.product_error = true;
                    //$scope.selectedProdcuts.splice(key,1);
                });
            } else {
                $scope.product_error = true;
            }

            temp.data.totalCost = $scope.grandTotal;
            temp.data.bayar = 0;
            temp.data.kembali = 0;
            temp.data.first_name = $scope.FirstName;
            temp.data.last_name = $scope.LastName;
            temp.data.mobile_no = $scope.MobileNo;
            temp.data.payment_type = $scope.PaymentType;
            temp.data.date = $scope.BillDate;



            // SELECT p.nama_produk, SUM( quantity ) , tsk.date
            // FROM detail_transaksi AS d
            // INNER JOIN produk AS p ON d.idproduk = p.idproduk
            // INNER JOIN transaksi AS tsk ON d.idtransaksi = tsk.idtransaksi
            // GROUP BY DATE( tsk.date ) 
            // ORDER BY tsk.date DESC 
            // LIMIT 0 , 30

            // SELECT p.nama_produk, SUM( quantity ) , tsk.date
            // FROM detail_transaksi AS d
            // INNER JOIN produk AS p ON d.idproduk = p.idproduk
            // INNER JOIN transaksi AS tsk ON d.idtransaksi = tsk.idtransaksi
            // GROUP BY tsk.date
            // ORDER BY tsk.date DESC 
            // LIMIT 0 , 30
            // $timeout($window.print, 0);
            if ($scope.product_error == false) {
                $http.post(urlServer + 'checkout.php', temp.data).success(function (data) {
                    if (data) {
                        $scope.msg_prod = true;
                        $scope.bill_id = data;
                        $("#billId").html('');
                        $("#billId").html(data);
                         myCallback();
                        //console.log(data)
                    } else {
                        alert('Error: Please try again');
                    }

                });

            }

            //if ($scope.bill_id != 0) {

            //}
        }
        $scope.setSubtotal = function (qty, index) {
            $scope.selectedProdcuts[index].subTotal = +parseFloat(qty * $scope.selectedProdcuts[index].price);
            $scope.totalCost();
            $scope.grandTotalOld = $scope.grandTotal;
        }
        $scope.totalCost = function () {
            var total = 0;
            angular.forEach($scope.selectedProdcuts, function (item) {
                total += item.subTotal;
            });
            $scope.grandTotal = +parseFloat(total).toFixed(2);
            $scope.grandTotalOld = +parseFloat(total).toFixed(2);
        };
        $scope.removeItemById = function ($index) {
            $scope.selectedProdcuts.splice($index, 1);
            $scope.product_error = false;
            $scope.totalCost();
            $scope.grandTotalOld = 0;
            $scope.discount_value = 0;
        }
        $scope.ClearData = function (product, $index) {
            if (typeof product.product === 'undefined') {
                $scope.selectedProdcuts[$index].price = 0;
                $scope.selectedProdcuts[$index].quantity = 0;
                $scope.selectedProdcuts[$index].subTotal = 0;
                $scope.totalCost();
                $scope.grandTotalOld = 0;
                $scope.discount_value = 0;

            }
        }
        $scope.update = function (p) {
            var data = {
                nama_produk: p.nama_produk,
                harga: p.harga,
                id: p.idproduk,
                idkategori: p.idkategori,
                action: 'update_product'
            }
            $http.put(urlServer + 'transaksi.php', data).success(function (data) {
                if (data) {
                    $scope.msg = true;
                } else {
                    alert('Error: Please try again');
                }
            });
        }
        $scope.close = function () {
            if ($scope.msg) {
                window.location = "http://localhost/inventoryApp/#/product";
            }
            $scope.msg = false;
            $scope.product_error = false;
        }
        $scope.discount = function () {
            // if ($scope.grandTotalOld == undefined || $scope.grandTotalOld == 0) {
            //     $scope.grandTotalOld = $scope.grandTotal;
            // }
            var test = ($scope.grandTotal * $scope.discount_value) / 100;
            $scope.grandTotalOld = $scope.grandTotal - test;
        }
    }])

    .value('version', '1.0.0');
; 'use strict';


angular.module('ngCart.directives', ['ngCart.fulfilment'])

    .controller('CartController', ['$scope', 'ngCart', function ($scope, ngCart) {
        $scope.ngCart = ngCart;
    }])

    .directive('ngcartAddtocart', ['ngCart', function (ngCart) {
        return {
            restrict: 'E',
            controller: 'CartController',
            scope: {
                id: '@',
                name: '@',
                quantity: '@',
                quantityMax: '@',
                price: '@',
                data: '='
            },
            transclude: true,
            templateUrl: function (element, attrs) {
                if (typeof attrs.templateUrl == 'undefined') {
                    return 'template/ngCart/addtocart.html';
                } else {
                    return attrs.templateUrl;
                }
            },
            link: function (scope, element, attrs) {
                scope.attrs = attrs;
                scope.inCart = function () {
                    return ngCart.getItemById(attrs.id);
                };

                if (scope.inCart()) {
                    scope.q = ngCart.getItemById(attrs.id).getQuantity();
                } else {
                    scope.q = parseInt(scope.quantity);
                }

                scope.qtyOpt = [];
                for (var i = 1; i <= scope.quantityMax; i++) {
                    scope.qtyOpt.push(i);
                }

            }

        };
    }])

    .directive('ngcartCart', [function () {
        return {
            restrict: 'E',
            controller: 'CartController',
            scope: {},
            templateUrl: function (element, attrs) {
                if (typeof attrs.templateUrl == 'undefined') {
                    return 'template/ngCart/cart.html';
                } else {
                    return attrs.templateUrl;
                }
            },
            link: function (scope, element, attrs) {

            }
        };
    }])

    .directive('ngcartSummary', [function () {
        return {
            restrict: 'E',
            controller: 'CartController',
            scope: {},
            transclude: true,
            templateUrl: function (element, attrs) {
                if (typeof attrs.templateUrl == 'undefined') {
                    return 'template/ngCart/summary.html';
                } else {
                    return attrs.templateUrl;
                }
            }
        };
    }])

    .directive('ngcartCheckout', [function () {
        return {
            restrict: 'E',
            controller: ('CartController', ['$rootScope', '$scope', 'invenServ', 'ngCart', 'fulfilmentProvider', function ($rootScope, $scope, invenServ, ngCart, fulfilmentProvider) {
                $scope.ngCart = ngCart;

                $scope.checkout = function () {
                    fulfilmentProvider.setService($scope.service);
                    fulfilmentProvider.setSettings($scope.settings);
                    fulfilmentProvider.checkout()
                        .success(function (data, status, headers, config) {
                            $rootScope.$broadcast('ngCart:checkout_succeeded', data);
                            ngCart.empty();
                            ngCart.bayar = 0;
                            ngCart.showdata();
                            invenServ.showTrans();
                            invenServ.getLastTrans();

                            // show notification

                        })
                        .error(function (data, status, headers, config) {
                            $rootScope.$broadcast('ngCart:checkout_failed', {
                                statusCode: status,
                                error: data
                            });
                        });
                }
            }]),
            scope: {
                service: '@',
                settings: '='
            },
            transclude: true,
            templateUrl: function (element, attrs) {
                if (typeof attrs.templateUrl == 'undefined') {
                    return 'template/ngCart/checkout.html';
                } else {
                    return attrs.templateUrl;
                }
            }
        };
    }]);
;
angular.module('ngCart.fulfilment', [])
    .service('fulfilmentProvider', ['$injector', function ($injector) {

        this._obj = {
            service: undefined,
            settings: undefined
        };

        this.setService = function (service) {
            this._obj.service = service;
        };

        this.setSettings = function (settings) {
            this._obj.settings = settings;
        };

        this.checkout = function () {
            var provider = $injector.get('ngCart.fulfilment.' + this._obj.service);
            return provider.checkout(this._obj.settings);

        }

    }])


    .service('ngCart.fulfilment.log', ['$q', '$log', 'ngCart', function ($q, $log, ngCart) {

        this.checkout = function () {

            var deferred = $q.defer();

            $log.info(ngCart.toObject());
            deferred.resolve({
                cart: ngCart.toObject()
            });

            return deferred.promise;

        }

    }])

    .service('ngCart.fulfilment.http', ['$http', 'ngCart', function ($http, ngCart) {

        this.checkout = function (settings) {
            return $http.post(settings.url,
                { data: ngCart.toObject(), options: settings.options });
        }
    }])


    .service('ngCart.fulfilment.paypal', ['$http', 'ngCart', function ($http, ngCart) {


    }]);