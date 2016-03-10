app
    .controller('addProductCtrl', function ($scope, $state, $http, addXService, ipAddressService) {


        $scope.userCompany = {};
        $scope.currentUser = {};
        $scope.token = sessionStorage.token;
        $scope.addedUser = [];
        $scope.latt = '';
        $scope.longg = '';
        $scope.admin = {};
        $scope.errTitle = '';
        $scope.existErr = false;
        $scope.pushData = {};
        $scope.ipAddress = '';
        $scope.product = {
            name: '',
            qty: ''
        }
        $scope.adminProductArr = {};
        var latt;
        var longg;


        if (!sessionStorage.data) {
            sessionStorage.removeItem('data');
            sessionStorage.removeItem('token');
            sessionStorage.state = 'signin';
            $state.go('signin')

        }
        else {
            $scope.id = JSON.parse(sessionStorage.data);
        }

    $scope.loggedInUser = addXService.getLog($scope.token);

    $scope.loggedInUser.$loaded().then(function (user) {
      if(typeof user[0] == 'object'){
          $scope.admin = user[0];
          $scope.adminProductArr.adminId = user[0].id;
      }
    })

        // userLogin()
        // function userLogin() {
        //     //this for getting user's data
        //     $http.post('/getUser', { userId: $scope.id.adminId })
        //         .success(function (data) {
        //             if (data == null) {
        //                 sessionStorage.removeItem('token');
        //                 sessionStorage.state = 'signin';
        //                 $state.go('signin')
        //             }
        //             else if (data != null) {
        //                 $scope.currentUser = data;
        //             }
        //             navigator.geolocation.getCurrentPosition(function (position) {
        //                 latt = position.coords.latitude;
        //                 longg = position.coords.longitude;
        //                 $scope.latt = position.coords.latitude;
        //                 $scope.longg = position.coords.longitude;
        //             });
        //         })
        //         .error(function (err) {
        //             console.log(err)
        //         })
        // }
        navigator.geolocation.getCurrentPosition(function (position) {
            latt = position.coords.latitude;
            longg = position.coords.longitude;
            $scope.latt = position.coords.latitude;
            $scope.longg = position.coords.longitude;
        });
        ipAddressService.ip(function (ip) {
            $scope.ipAddress = ip;
        });


        $scope.addProduct = function (prodObj) {
            prodObj.latt = $scope.latt;
            prodObj.longg = $scope.longg;
            prodObj.dateNow = new Date() + '';
            prodObj.adminId = $scope.id.adminId;
            prodObj.companyId = $scope.id.companyId;



            $http.post('/addProduct', prodObj)
                .success(function (data) {
                    if (typeof data == "object") {
                        //$scope.addedUser.push(data);
                        $scope.pushData = angular.copy(data);
                        $scope.pushData.ipAddress = $scope.ipAddress;
                        $scope.pushData.userAgent = navigator.userAgent;
                        $scope.pushData.id = $scope.pushData._id;
                        //for product id
                        $scope.adminProductArr.prodId = $scope.pushData._id;
                        /*//*/

                        //for adding product to firebase with product in user's array
                        addXService.addProduct($scope.pushData,$scope.admin.id,function(){
                            console.log('success')
                            /*//*/
                            //for adding product in mongodb user's array
                            $http.post('/addToProductArr', $scope.adminProductArr)
                                .success(function (data) {
                                    $scope.product = {
                                        name: '',
                                        qty: ''
                                    }
                                    $state.go('add')
                                })
                                .error(function(err){
                                    $scope.errTitle = err;
                                    $scope.existErr = true;
                                })

                        },function(){
                            console.log('we got a situation here')
                        })
                        console.log(data)


                    }
                    else {
                        console.log(data)
                        if (typeof (data) == 'string') {
                            $scope.errTitle = data;
                            $scope.existErr = true;
                        }

                    }

                })
                .error(function (err) {
                    console.log(err)

                    $scope.existErr = true;

                })
        };
    })
