var cities = [
    // {
    //     city: 'Toronto',
    //     desc: 'This is the best city in the world!',
    //     lat: 43.7000,
    //     long: -79.4000
    // },
    // {
    //     city: 'New York',
    //     desc: 'This city is aiiiiite!',
    //     lat: 40.6700,
    //     long: -73.9400
    // },
    // {
    //     city: 'Chicago',
    //     desc: 'This is the second best city in the world!',
    //     lat: 41.8819,
    //     long: -87.6278
    // },
    // {
    //     city: 'Los Angeles',
    //     desc: 'This city is live!',
    //     lat: 34.0500,
    //     long: -118.2500
    // },
    // {
    //     city: 'Las Vegas',
    //     desc: 'Sin City...\'nuff said!',
    //     lat: 36.0800,
    //     long: -115.1522
    // }
];

app
    .controller('googleapiCtrl', function ($scope, $http, $state, addXService, $ionicPlatform, $cordovaGeolocation, $cordovaDevice,NgMap) {

    $scope.userLattLongg = [];
    $scope.admin = {};
    $scope.token = sessionStorage.token;
    if (!sessionStorage.token || !sessionStorage.data) {
      sessionStorage.removeItem('data');
      sessionStorage.removeItem('token');
      sessionStorage.state = 'signin';
      $state.go('signin')
      return
    }
    $scope.loggedInUser = addXService.getLog($scope.token);
    $scope.loggedInUser.$loaded().then(function (user) {
      if (typeof user[0] == 'object') {
        $scope.admin = user[0];
        /*$scope.adminLatt = $scope.admin.latitude;
         $scope.adminLongg = $scope.admin.longitude;*/
      }
      angular.forEach($scope.admin.users, function (val, key) {
        console.log(key);
        $scope.lattLongg = addXService.getProdByUserId(key);
        $scope.lattLongg.$loaded().then(function (prod) {
          for (key in prod) {
            if (typeof prod[key] == 'object') {
              $scope.userLattLongg.push(prod[key]);
            }
          }

        })

      });
      if (user.length <= 0) {
        sessionStorage.removeItem('data');
        sessionStorage.removeItem('token');
        sessionStorage.state = 'signin';
        $state.go('signin')
      }
    });







    // The following example creates a marker in Stockholm, Sweden using a DROP
    // animation. Clicking on the marker will toggle the animation between a BOUNCE
    // animation and no animation.

   /*     $scope.latt = '';
        $scope.longg = '';
        $scope.products = [];

        if (!sessionStorage.data) {
            sessionStorage.removeItem('data');
            sessionStorage.removeItem('token');
            sessionStorage.state = 'signin';
            $state.go('signin')

        }
        else {
            $scope.id = JSON.parse(sessionStorage.data);
        }

        init()
        function init() {
            $http.post('/getProduct', { userId: $scope.id.userId })
                .success(function (prods) {
                    $scope.products = prods;
                    prods.forEach(function(val) {
                    if(val.name){
                        cities.push({city: val.name, desc:'hello', lat: +val.lattitude, long: -(+val.longitude)})
                    }
                });
                })
                .error(function (err) {
                    console.log(err);
                })

           /!* navigator.geolocation.getCurrentPosition(function (position) {
                // latt = position.coords.latitude;
                // longg = position.coords.longitude;
                $scope.latt = position.coords.latitude;
                $scope.longg = position.coords.longitude;
            });*!/
        }

        var mapOptions = {
            zoom: 4,
            center:  new google.maps.LatLng(40.0000, -98.0000),
            mapTypeId: google.maps.MapTypeId.TERRAIN
        }

        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        $scope.markers = [];

        var infoWindow = new google.maps.InfoWindow();

        var createMarker = function (info) {

            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(info.lat, info.long),
                title: info.city
            });
            marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                infoWindow.open($scope.map, marker);
            });

            $scope.markers.push(marker);

        }

        for (i = 0; i < cities.length; i++) {
            createMarker(cities[i]);
        }

        $scope.openInfoWindow = function (e, selectedMarker) {
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, 'click');
        }*/


    });
