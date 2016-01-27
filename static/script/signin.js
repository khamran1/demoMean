angular.module('app.signin', [])
    .controller('appSigninController', function ($scope, $state, $http) {
        $scope.getObj = null;
        $scope.alluser = [];
        $scope.signinErr = false;

        if (sessionStorage.token) {
            sessionStorage.state = 'dashboard';
            $state.go('dashboard');
        }
        $scope.signin = function (userObj) {
            $scope.currUser = userObj;
            $http.post('/signin', userObj)
                .success(function (data) {
                    if (data == null) {
                        $scope.signinErr = true;
                    } else {
                        $scope.signinErr = false;
                        $scope.currMongoUser = data;
                        sessionStorage.token = data.token;
                        sessionStorage.data = JSON.stringify({adminId: data._id});
                        if (sessionStorage.token) {
                            sessionStorage.token = data.token;
                            sessionStorage.state = 'dashboard';
                            $state.go('dashboard');
                        }
                        else {
                            $scope.signinErr = true;
                        }
                    }



                })
                .error(function (err) {
                    $scope.signinErr = true;
                    console.log(err)
                })

        }
        $scope.signUp = function () {
            sessionStorage.state = 'signup'
            $state.go('signup');
        }

    });
