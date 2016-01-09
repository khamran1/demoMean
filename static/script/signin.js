angular.module('app.signin',[])
    .controller('appSigninController',function($scope,$state){
        $scope.signin = function(){
            $state.go('signup');
        }
    });
