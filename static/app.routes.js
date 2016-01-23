var myApp = angular.module('app',
    [
        'ui.router',
        'firebase',
        'app.signin',
        'app.signup',
        'app.welcome',
        'app.addUsers'
    ]);
myApp.controller('meanCtrl', function ($scope,$state) {
    $scope.signOutButton = false;
    
    if(sessionStorage.token && sessionStorage.state == 'dashboard'){
        $scope.signOutButton = true;
    }
    else if(sessionStorage.state == 'signin' || sessionStorage.state == 'signup'){
        $scope.signOutButton = false;
    }
    $scope.signOut = function(){
        sessionStorage.removeItem('token');
        if(sessionStorage.state == 'dashboard'){
            sessionStorage.state == 'signin'
            $state.go('/')    
        }
        
    }
});
myApp.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('/', {
            url: "/",
            templateUrl: "./views/signin.html",
            controller:'appSigninController'
        })
        .state('signup', {
            url: "/signup",
            templateUrl: "./views/signup.html",
            controller:'appSignupController'
        })
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "./views/welcome.html",
            controller:'appWelcomeController'
        })
        .state('addUsers', {
            url: "/addUsers",
            templateUrl: "./views/addUsers.html",
            controller:'appAddUsersController'
        })
    $urlRouterProvider.otherwise("/");
});