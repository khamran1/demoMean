app
  .controller('signupCtrl', function ($scope, $state, $http, loginService, dateTimeService, ipAddressService, $ionicLoading) {
    $scope.latt = '';
    $scope.longg = '';
    $scope.ipAddress = '';
    $scope.errText = '';
    $scope.err = false;
    var signinObj = {};
    navigator.geolocation.getCurrentPosition(function (position) {
      latt = position.coords.latitude;
      longg = position.coords.longitude;
      $scope.latt = position.coords.latitude;
      $scope.longg = position.coords.longitude;
    });
    ipAddressService.ip(function (ip) {
      $scope.ipAddress = ip;
    });
    $scope.localDateTime = dateTimeService.madeTime('');
    $scope.signup = function (userObj) {
      $ionicLoading.show({
        //content: 'Loading',
        template: '<ion-spinner icon="android"></ion-spinner>',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0,
        hideOnStageChange: true
      });
      loginService.signupToken(userObj, function (userData) {


        console.log("Successfully created user account with uid:", userData.uid);
        console.log(userData);
        userObj.token = userData.uid;
        $http.post('/signup', userObj)
          .success(function (data) {
            if (data != null) {
              if (typeof data == 'object') {
                userObj.localDateTime = dateTimeService.madeTime('');
                userObj.latitude = $scope.latt;
                userObj.longitude = $scope.longg;
                userObj.ipAddress = $scope.ipAddress;
                userObj.userAgent = navigator.userAgent;
                userObj.serverTimestamp = new Date().getTime();
                userObj.role = "Admin";
                userObj.id = data._id;
                loginService.signUp(userObj, function () {
                  signinObj = {

                    email: userObj.email,
                    localDateTime: $scope.localDateTime,
                    ipAddress: $scope.ipAddress,
                    latitude: $scope.latt,
                    longitude: $scope.longg,
                    userAgent: navigator.userAgent,
                    serverTimestamp: new Date().getTime(),
                    role: 'Admin',
                    token: data.token,
                    id: data._id

                  }
                  loginService.logAdmin(signinObj, function () {

                  })
                  $scope.currMongoUser = data;
                  sessionStorage.token = data.token;
                  sessionStorage.data = JSON.stringify({ adminId: data._id });
                  sessionStorage.state = 'dashboard';
                  $ionicLoading.hide();
                  $state.go('dashboard');

                }, function () {
                  $ionicLoading.hide();
                  $scope.errText = 'Signing up try again please';
                  $scope.err = true;
                })
              }
              else if (typeof data == 'string') {
                $ionicLoading.hide();
                $scope.errText = data;
                $scope.err = true;
              }
            }
            else {
              $ionicLoading.hide();
              $scope.errText = data;
              $scope.err = true;
            }


          })
          .error(function (err) {
            $ionicLoading.hide();
            console.log(err)
          })


      }, function (error) {
        $ionicLoading.hide();
        $scope.errText = 'Email already taken try again please';
        $scope.err = true;
        console.log("Error creating user:", error);
      })

    }
  })
