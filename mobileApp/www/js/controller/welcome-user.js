app
  .controller('welcomeUserCtrl', function ($scope, $state, $http, $stateParams, addXService, $ionicLoading) {
        //$ionicLoading.hide();
    $scope.currentUser = {};
    $scope.userCompany = {};
    $scope.products = [];
    $scope.latt = '';
    $scope.longg = '';
    $scope.errTitle = '';
    $scope.existErr = false;

    var latt;
    var longg;
    $scope.geoLoc = {};
    $scope.showMap = function () {
      $state.go('googleMap')
    }
    if (!sessionStorage.data) {
      sessionStorage.removeItem('data');
      sessionStorage.removeItem('token');
      sessionStorage.state = 'signin';
      $state.go('signin')

    }
    else {
      $scope.id = JSON.parse(sessionStorage.data);
    }

    addXService.getUser($scope.id.userId,function(user){
            $scope.currentUser = user[Object.keys(user)[0]];
            $scope.userCompany = addXService.getUserCompany($scope.currentUser.companyId)
            $scope.userCompany.$loaded().then(function (comp) {
                $scope.userCompany = $scope.userCompany[0]
                if(comp){
                        $scope.products = addXService.getProduct($scope.userCompany.id)
                        $scope.products.$loaded().then(function () {
                        })
                    }

                })
                //$scope.userCompany = company[Object.keys(company)[0]];
                //addXService.getProduct($scope.userCompany.id,function(prods){
                    //if(prods){
                       // angular.forEach(prods,function(val,key){
                        //    if(typeof val == 'object'){
                        //        $scope.products.push(val)
                      //      }
                     //   })
                   // }
                    //$scope.$apply()
               // })

           // });

        });






    userLogin();
    function userLogin() {
      //this for getting user's data
     /* $http.post('/getUser', {userId: $scope.id.userId})
        .success(function (data) {
          if (data == null) {
            sessionStorage.removeItem('token');
            sessionStorage.state = 'signin';
            $state.go('signin')
          }
          else if (data != null) {
            $scope.currentUser = data;
            //this for getting user's company
            $http.post('/getUsersCompany', {companyId: data.companyId})
              .success(function (company) {
                if (company == null) {
                  $scope.errTitle = '';
                  $scope.existErr = false;
                }
                else if (company != null) {
                  $scope.userCompany = company;
                  $http.post('/getProduct', {userId: company._id})
                    .success(function (prods) {
                      $scope.products = prods;
                    })
                    .error(function (err) {
                      console.log(err);
                    })
                }

              })
              .error(function (err) {
                console.log(err);
              })

          }




        })
        .error(function (err) {
          console.log(err)
          //alert('you are not an authorize user please login again ')
          // sessionStorage.state = 'signin'
          // $state.go('/')
        })*/

        navigator.geolocation.getCurrentPosition(function (position) {
            latt = position.coords.latitude;
            longg = position.coords.longitude;
            $scope.latt = position.coords.latitude;
            $scope.longg = position.coords.longitude;
        });
    }

    $scope.addProduct = function (prodObj) {
      /*   prodObj.latt = $scope.latt;
       prodObj.longg = $scope.longg;
       prodObj.dateNow = new Date() + '';
       prodObj.userId = $scope.currentUser._id;
       $http.post('/addProduct', prodObj)
       .success(function (data) {
       if (typeof data == "object") {
       $scope.addedUser.push(data)
       console.log(data)
       }
       else {
       console.log(data)
       if(typeof(data) == 'string'){
       $scope.errTitle = data;
       $scope.existErr = true;
       }

       }

       })
       .error(function (err) {
       console.log(err)

       $scope.existErr = true;

       })*/
      $state.go('addProduct')
    };
    $scope.getProduct = function (prod) {
        prod.userId = $scope.currentUser.id;
        prod.email = $scope.currentUser.email;
      sessionStorage.productData = JSON.stringify(prod);
      $state.go('getProduct')
    }

  })
