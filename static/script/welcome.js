angular.module('app.welcome', [])
    .controller('appWelcomeController', function ($scope, $state, $http, $stateParams) {
        $scope.userId = decodeURIComponent($stateParams.id);
        $scope.token = sessionStorage.token;
        $scope.getObj = null;
        $scope.currentUser = '';
        // $scope.signinErr = false;
        // $scope.err.userAdding = false;
        $scope.success = false;
        userLogin()
        function userLogin() {
            $http.post('/dashboard', { token: $scope.token })
                .success(function (data) {
                    $scope.currentUser = data;
                })
                .error(function (err) {
                    //alert('you are not an authorize user please login again ')
                    sessionStorage.state = 'signin'
                    $state.go('/')
                })
        }
        $scope.addCompany = function (companyObj) {
            companyObj.uid = $scope.currentUser._id;
            $http.post('/addCompany', companyObj)
                .success(function (data) {
                    console.log(data)
                    $scope.success = true;
                    $state.go('addUsers');
                })
                .error(function (err) {
                    console.log(err)
                    $scope.success = false;
                });
                $http.post('/addCompany', companyObj)
                .success(function (data) {
                    console.log(data)
                    $scope.success = true;
                    $state.go('addUsers');
                })
                .error(function (err) {
                    console.log(err)
                    $scope.success = false;
                })

        }


    })