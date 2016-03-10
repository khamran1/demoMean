/**
 * Created by Hamid Ali on 2/10/2016.
 */

app
  .controller('getProductCtrl', function ($scope, $state, $http, addXService) {

        $scope.compareQty = null;
        $scope.errTitle = null;
        $scope.existErr = false;
        $scope.product = {};
        var userId ='';
        var prodID = '';
        var useremail = '';

    (function(){

      if (sessionStorage.productData) {
        $scope.sessionData = JSON.parse(sessionStorage.productData);
        $scope.sessionUserData = JSON.parse(sessionStorage.data);

      } else {
        if (sessionStorage.data) {
          $state.go('welcome')
        }
        else {
          $state.go('signin')
        }
      }
      //$scope.$apply()
    })();

    $scope.product = $scope.sessionData;
    const x = $scope.sessionData.quantity;

    //$scope.sessionData.quantity = $scope.compareQty;

    $scope.getProd = function(prod){
      console.log(prod);
        prod.getProdTime = new Date()+ '';
        delete prod.addedOn;

      //$scope.sessionData.quantity = $scope.compareQty;
      if(prod.quantity > x ){
        $scope.errTitle = "Please enter quantity less than the total amount";
        $scope.existErr = true;
      } else{
        prod.quantity = x - prod.quantity ;
          //$scope.sessionData.quantity = prod.quantity;
          prodID = prod.id;
          userId = prod.userId;
          useremail = prod.email;
        $http.post('/userGetsProduct',prod)
          .success(function(prodX){
            console.log(prodX)
                prodX.prodId = prodID;
                prodX.email = useremail;
                prodX.userId = userId;

                addXService.takeProduct(prodX, function () {
                   // console.log("kaka");
                    $state.go('welcome');
                })
          })
          .error(function(err){
            console.log(err)
          })
        $scope.errTitle = null;
        $scope.existErr = false;
      }
      //$http.post('/addToActivity', compX)
      //  .success(function (data) {
      //    $scope.addedUser = data;
      //    console.log(data);
      //  })
      //  .error(function (err) {
      //    console.log(err);
      //  })
    }

  })
