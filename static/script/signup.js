angular.module('app.signup',[])
    .controller('appSignupController',function($scope,$state){
        $scope.signup = function(){
            $state.go('signin');
        }
    });