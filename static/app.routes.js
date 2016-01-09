var myApp = angular.module('app',
    [
        'ui.router',
        'app.signin',
        'app.signup'
    ]);
myApp.controller('meanCtrl', function () {

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
    $urlRouterProvider.otherwise("/");
});