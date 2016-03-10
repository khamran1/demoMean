/**
 * Created by Hamid Ali on 1/31/2016.
 */

app
    .controller('addUserCtrl', function ($scope, $state, $http, ipAddressService, addXService, dateTimeService) {
        $scope.addedUser = [];
        $scope.token = sessionStorage.token;
        $scope.productArr = [];
        $scope.companyObj = {}
        $scope.existErr = false;
        $scope.errTitle = '';
        $scope.ipAddress = '';
        $scope.latt = '';
        $scope.admin = {};
        $scope.userArrObj = {}
        $scope.longg = '';
        $scope.abc = {}
        $scope.user = {
            name:'',
            email:'',
            pass:''
        }
        if (!sessionStorage.data || !sessionStorage.token) {
            sessionStorage.removeItem('data');
            sessionStorage.removeItem('token');
            sessionStorage.state = 'signin';
            $state.go('signin')

        }
        else {
            $scope.sessionData = JSON.parse(sessionStorage.data);
        }

        $scope.addedUser = addXService.getUsers($scope.sessionData.companyId);
        $scope.addedUser.$loaded().then(function(user){

        })

        $scope.loggedInUser = addXService.getLog($scope.token);

        $scope.loggedInUser.$loaded().then(function (user) {
          if(typeof user[0] == 'object'){
            $scope.admin = user[0]
              $scope.userArrObj.adminId = user[0].id
          }
            if(user.length <= 0 ){
                sessionStorage.removeItem('data');
                sessionStorage.removeItem('token');
                sessionStorage.state = 'signin';
                $state.go('signin')
            }
        })


        addXService.getSingleCompany($scope.sessionData.companyId,function(company){

            if(company){
                $scope.companyObj = company[Object.keys(company)[0]]
                $scope.$apply();
                /*angular.forEach(company,function(val,key){
                    if(typeof val == 'object'){
                        $scope.companyObj.push(val)
                    }
                })*/

            }
        });
        $scope.productArr = addXService.getProduct($scope.sessionData.companyId);
        $scope.productArr.$loaded().then(function () {

//            console.log($scope.productArr);
            //$scope.$apply()
        })

        init();
        function init() {
            var compX = {
                id: $scope.sessionData.companyId
            };

          /*            $http.post('/getAllCompanyUsers', compX)
                .success(function (data) {
                    $scope.addedUser = data;
                    console.log(data);
                })
                .error(function (err) {
                    console.log(err);
                })*/

      /*    $http.post('/getProduct', { userId: $scope.sessionData.companyId })
                .success(function (prods) {
                    $scope.products = prods;
                })
                .error(function (err) {
                    console.log(err);
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

        }
        $scope.addUser = function (userObj) {
            userObj.companyId = $scope.sessionData.companyId;
            $http.post('/addCompanyUsers', userObj)
                .success(function (data) {
                    if (typeof data == "object") {
                      //$scope.addedUser.push(data)
                      console.log(data);
                      $scope.copiedData = angular.copy(data);
                      $scope.copiedData.serverTimestamp = new Date().getTime();
                      $scope.copiedData.localDateTime = dateTimeService.madeTime('');
                      $scope.copiedData.latitude = $scope.latt;
                      $scope.copiedData.id = $scope.copiedData._id;
                      $scope.userArrObj.userId = $scope.copiedData._id;
                      $scope.copiedData.longitude = $scope.longg;
                      $scope.copiedData.ipAddress = $scope.ipAddress;
                      $scope.copiedData.userAgent = navigator.userAgent;
                      $scope.copiedData.adminId = $scope.sessionData.adminId;

                      addXService.addUsers($scope.copiedData,$scope.admin.id, function(){
                      $http.post('/addUsersToArr',$scope.userArrObj)
                          .success(function(){

                          })
                          .error(function(){
                              $scope.errTitle = data;
                              $scope.existErr = true;
                          })
                      },function(){
                        console.log('we got a situation here')
                      })

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
            $scope.user = {
                name:'',
                email:'',
                pass:''
            }
        };
        $scope.addProduct = function () {
            $state.go('addProduct')
        }
    });
