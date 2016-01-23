angular.module('app.signup', [])
    .controller('appSignupController', function ($scope, $state, $http) {
        $scope.signup = function (userObj) {
            var ref = new Firebase("https://dunnowhat.firebaseio.com");
            ref.createUser({
                email: userObj.email,
                password: userObj.pass
            }, function (error, userData) {
                if (error) {
                    console.log("Error creating user:", error);
                } else {
                    console.log("Successfully created user account with uid:", userData.uid);
                    console.log(userData);
                    userObj.token = userData.uid;
                    $http.post('/signup', userObj)
                        .success(function (data) {
                            $scope.currMongoUser = data;
                            sessionStorage.token = data.token;
                            sessionStorage.state = 'dashboard';
                            $state.go('dashboard');
                        })
                        .error(function (err) {
                            console.log(err)
                        })
                }
            });



        }

    });