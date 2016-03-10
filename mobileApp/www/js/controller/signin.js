app
    .controller('signinCtrl', function ($scope, $state, $http,loginService,dateTimeService,ipAddressService,$ionicLoading) {
        $scope.getObj = null;
        $scope.alluser = [];
        $scope.signinErr = false;
        $scope.smartDevice = false;
        $scope.latt = '';
        $scope.longg = '';
        $scope.ipAddress = '';
        $scope.localDateTime = '';
        $scope.loader = false;



        if (sessionStorage.data && sessionStorage.token && $scope.smartDevice == false) {
//            sessionStorage.removeItem('data');
            $state.go('dashboard');
            return
        }else if(sessionStorage.data && !$scope.smartDevice){
            $state.go('welcome');
            return
        }
        (function(){
            var ua = navigator.userAgent.toLowerCase();
            var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
            var ios = ua.indexOf("iphone") > -1; //&& ua.indexOf("mobile");
            var windows = ua.indexOf("nokia") > -1; //&& ua.indexOf("mobile");
            if (isAndroid || ios || windows) {
                $scope.smartDevice = true;
                // Do something!
                // Redirect to Android-site?
                console.log('smart device is here')
            }

            navigator.geolocation.getCurrentPosition(function (position) {
                                 latt = position.coords.latitude;
                                 longg = position.coords.longitude;
                                 $scope.latt = position.coords.latitude;
                                 $scope.longg = position.coords.longitude;
                             });

            $scope.localDateTime = dateTimeService.madeTime('');
            ipAddressService.ip(function(ip){
                $scope.ipAddress = ip;
            });

        })()

        $scope.signin = function (userObj) {
          $ionicLoading.show({
           //content: 'Loading',
           template: '<ion-spinner icon="dots"></ion-spinner>',
           animation: 'fade-in',
           showBackdrop: true,
           maxWidth: 200,
           showDelay: 0,
           hideOnStageChange: true
           });
            $scope.currUser = userObj;
            if(userObj.email == undefined){
                $ionicLoading.hide();
                $scope.signinErr = true;
            }else{
                var userData = {

                    email: userObj.email,
                    localDateTime: $scope.localDateTime,
                    ipAddress: $scope.ipAddress,
                    latitude: $scope.latt,
                    longitude: $scope.longg,
                    userAgent:navigator.userAgent,
                    serverTimestamp:new Date().getTime(),
                    role:'Admin'

                }

            }

            //console.log(userData);
            if ($scope.smartDevice) {

                $http.post('/usersignin', userObj)
                    .success(function (data) {
                        if (data == null) {
                            $scope.signinErr = true;
                            $ionicLoading.hide();
                        }
                        else if (typeof data == 'string') {
                            $scope.signinErr = true;
                        }
                        else if(typeof data == 'object') {
                            $scope.signinErr = false;
                            $scope.currUser = data;
                            userData.role = 'User';
                            loginService.logUser(userData,function(){
                                sessionStorage.data = JSON.stringify({ userId: data._id });
                                $scope.signinErr = false;
                                $ionicLoading.hide();
                                $state.go('welcome');

                            },function(){
                                $ionicLoading.hide();
                                $scope.signinErr = true;
                            });
                            //sessionData.userId = data._id
                            //sessionStorage.data = JSON.stringify({ userId: data._id });
                            //$ionicLoading.hide();
                            //$state.go('welcome');
                            // sessionStorage.data = JSON.stringify({adminId: data._id});
                            // if (sessionStorage.token) {
                            //     sessionStorage.token = data.token;
                            //     sessionStorage.state = 'dashboard';
                            //     $state.go('dashboard');
                            // }
                            // else {
                            //     $scope.signinErr = true;
                            // }
                        }


                    })
                    .error(function (err) {
                        $scope.signinErr = true;
                        console.log(err)
                    })


            }
            else {
              $scope.loader = true;
                //loginService.addUser(userObj,success)
                loginService.auth(userObj,function(){


                    $http.post('/signin', userObj)
                        .success(function (data) {
                            if (data == null) {
                                $ionicLoading.hide();
                                $scope.signinErr = true;
                            } else {
                                if (typeof data == 'object') {

                                    loginService.logAdmin(userData,function(){

                                    })
                                    $scope.signinErr = false;
                                    $scope.currMongoUser = data;
                                    sessionStorage.token = data.token;
                                    sessionStorage.data = JSON.stringify({ adminId: data._id });
                                    if (sessionStorage.token) {
                                        sessionStorage.token = data.token;
                                        sessionStorage.state = 'dashboard';
                                      $ionicLoading.hide();
                                        $state.go('dashboard');
                                    }
                                    else {
                                        $ionicLoading.hide();
                                        $scope.signinErr = true;
                                    }
                                }
                            }

                        })
                        .error(function (err) {
                            $ionicLoading.hide();
                            $scope.signinErr = true;
                            console.log(err)
                        })


                },function(){
                    $scope.signinErr = true;
                    $ionicLoading.hide();
                    $scope.loader = false;
                });



            }


        };

        $scope.signUp = function () {
            sessionStorage.state = 'signup'
            $state.go('signup');
        };
    console.log()
        //$scope.$apply();

    })
