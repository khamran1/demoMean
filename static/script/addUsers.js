angular.module('app.addUsers', [])
    .controller('appAddUsersController', function ($scope, $state, $http) {
        $scope.addedUser = [];

        $scope.addUser = function (userObj) {
            $http.post('/addCompanyUsers', userObj)
                .success(function (data) {
                    $scope.addedUser.push(data)
                    console.log(data)
                })
                .error(function (err) {
                    console.log(err)
                })
        }
    })