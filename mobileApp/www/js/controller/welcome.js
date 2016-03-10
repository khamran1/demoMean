app
  .controller('welcomeCtrl', function ($scope, $state, $http, $stateParams, addXService, dateTimeService, ipAddressService, $ionicLoading) {

    $scope.userId = decodeURIComponent($stateParams.id);
    $scope.token = sessionStorage.token;
    $scope.getObj = null;
    $scope.currentUser = {};
    $scope.companiesObj = [];
    $scope.loggedInUser = {};
    $scope.user = {};
    $scope.notifyLength = [];
    $scope.ipAddress = '';
    $scope.latt = '';
    $scope.longg = '';
    $scope.company = {
            name:''
        }
    //$scope.$apply();
    if (!sessionStorage.data || !sessionStorage.token) {
      sessionStorage.removeItem('data');
      sessionStorage.removeItem('token');
      sessionStorage.state = 'signin';
      $state.go('signin')

    }
    //$ionicLoading.hide();
    if (sessionStorage.data) {
      var sessionData = JSON.parse(sessionStorage.data);
    }
    else {
      var sessionData = {};
    }

    $scope.success = false;
    (function () {
      /*  $http.post('/dashboard', { token: $scope.token })
       .success(function (data) {
       if (data == null) {
       sessionStorage.removeItem('token');
       sessionStorage.state = 'signin';
       $state.go('signin')
       }
       else if (data != null) {
       $scope.currentUser = data;
       $http.post('/getCompanies', { userId: data._id })
       .success(function (company) {
       $scope.companiesObj = company;
       })
       .error(function (err) {
       console.log(err);
       })
       }

       })
       .error(function (err) {
       //alert('you are not an authorize user please login again ')
       sessionStorage.state = 'signin'
       $state.go('/')
       })*/


      ;
    })();

        $scope.loggedInUser = addXService.getLog($scope.token);

      $scope.loggedInUser.$loaded().then(function (user) {
        if(typeof user[0] == 'object'){
            $scope.user = user[0];
        }
        angular.forEach($scope.user.products,function(val,key){
          console.log(key);
          $scope.notification = addXService.getProdById(key)
            $scope.notification.$loaded().then(function(prod){
              for(key in prod){
                if(typeof prod[key] == 'object'){
                  $scope.notifyLength.push(prod[key]);
                }
              }

            })

        })
        if(user.length <= 0 ){
          sessionStorage.removeItem('data');
          sessionStorage.removeItem('token');
          sessionStorage.state = 'signin';
          $state.go('signin')
        }

      /* angular.forEach(user,function(val,ind){
       if(val.token){
       $scope.loggedInUser = val;
       }
       })*/
      ipAddressService.ip(function (ip) {
        $scope.ipAddress = ip;
      });
      navigator.geolocation.getCurrentPosition(function (position) {
        latt = position.coords.latitude;
        longg = position.coords.longitude;
        $scope.latt = position.coords.latitude;
        $scope.longg = position.coords.longitude;
      });
        $scope.companiesObj = addXService.getCompany($scope.user.id);
          $scope.companiesObj.$loaded().then(function(comp){
            console.log(comp)
          })
        $scope.$apply()
    });



    $scope.addCompany = function (companyObj) {

      companyObj.uid = $scope.user.id;
      $http.post('/addCompany', companyObj)
        .success(function (data) {

//          $scope.companiesObj = [];
          //$scope.companiesObj.push(data);
          $scope.copiedData = angular.copy(data);
          delete $scope.copiedData.product;
          delete $scope.copiedData.users;
          $scope.copiedData.serverTimestamp = new Date().getTime();
          $scope.copiedData.localDateTime = dateTimeService.madeTime('');
          $scope.copiedData.latitude = $scope.latt;
          $scope.copiedData.id = $scope.copiedData._id;
          $scope.copiedData.longitude = $scope.longg;
          $scope.copiedData.ipAddress = $scope.ipAddress;
          addXService.addCompany($scope.copiedData, function () {
          });
          //console.log(data);
          // $scope.success = true;
          // $state.go('addUsers');
          var addCompObj = {
            userId: $scope.user.id,
            companyId: data._id
          }
          $http.post('/addToCompArr', addCompObj)
            .success(function (data1) {
              console.log(data1);
              // $scope.success = true;
              // $state.go('addUsers');
            })
            .error(function (err) {
              console.log(err)
              $scope.success = false;
            })
        })
        .error(function (err) {
          console.log(err)
          $scope.success = false;
        });
        $scope.company = {
            name:''
        }

    };

    $scope.goIntoCompany = function (company) {
        //sessionData.id = company.id
        sessionData.companyId = company.id;
        sessionStorage.data = JSON.stringify(sessionData);
        $state.go('add');
    };


  })
