// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('app', [
    'ionic',
    'firebase',
    'ngCordova',
    'ngMap'
    // ,
    // 'app.signin',
    // 'app.signup',
    // 'app.welcome',
    // 'app.addUsers',
    // 'app.usersignin',
    // 'app.welcomeuser'
])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

    .config(function($stateProvider,$urlRouterProvider){
        $stateProvider
          .state('signin', {
            url: '/',
            templateUrl: './www/views/signin.html',
            controller: 'signinCtrl'
          })
          .state('signup', {
            url: '/signup',
            templateUrl: './www/views/signup.html',
            controller: 'signupCtrl'
          })
          .state('dashboard', {
            url: '/dashboard',
            templateUrl: './www/views/welcome.html',
            controller: 'welcomeCtrl'
          })
          .state('welcome', {
            url: '/welcome',
            templateUrl: './www/views/welcome-user.html',
            controller: 'welcomeUserCtrl'
          })
          .state('add', {
            url: '/add',
            templateUrl: './www/views/addUser.html',
            controller: 'addUserCtrl'
          })
          .state('googleMap', {
            url: '/googleMap',
            templateUrl: './www/views/googleapi.html',
            controller: 'googleapiCtrl'
          })
          .state('addProduct', {
            url: '/addProduct',
            templateUrl: './www/views/addProduct.html',
            controller: 'addProductCtrl'
          })
            .state('getProduct', {
            url: '/getProduct',
            templateUrl: './www/views/getProduct.html',
            controller: 'getProductCtrl'
          })

        $urlRouterProvider.otherwise('/')
    })

.controller('mainCtrl',function($ionicSideMenuDelegate,$scope,$state){
    $scope.loader = false;
    $scope.state = sessionStorage.state;
    $scope.toggleLeft = function () {
      $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.$on('loader', function (event, data) {
      $scope.loader = data;
    })
    $scope.signOut = function () {
      if(sessionStorage.data || sessionStorage.token){
          sessionStorage.removeItem('data');
          sessionStorage.removeItem('token');
          sessionStorage.state = 'signin';
        $state.go('signin')

      }
    }
    //$scope.$apply();
  })
