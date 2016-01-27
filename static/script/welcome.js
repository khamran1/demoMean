angular.module('app.welcome', [])
    .controller('appWelcomeController', function ($scope, $state, $http, $stateParams) {
        $scope.userId = decodeURIComponent($stateParams.id);
        $scope.token = sessionStorage.token;
        $scope.getObj = null;
        $scope.currentUser = {};
        $scope.companiesObj = [];
        var sessionData = JSON.parse(sessionStorage.data);
        // $scope.signinErr = false;
        // $scope.err.userAdding = false;
        $scope.success = false;
        userLogin()
        function userLogin() {
            $http.post('/dashboard', { token: $scope.token })
                .success(function (data) {
                    if (data == null) {
                        sessionStorage.removeItem('token');
                        sessionStorage.state = 'signin';
                        $state.go('/')
                    }
                    else if (data != null) {
                        $scope.currentUser = data;
                        $http.post('/getCompanies',{userId:data._id})
                            .success(function (company) {
                                $scope.companiesObj = company;
                            })
                            .error(function (err) {
                                console.log(err);
                            })
                    }

                })
                .error(function (err) {
                    //alert('you are not an authorize user please login again ')
                    sessionStorage.state = 'signin'
                    $state.go('/')
                })
        }
        $scope.addCompany = function (companyObj) {
            companyObj.uid = $scope.currentUser._id;
            $http.post('/addCompany', companyObj)
                .success(function (data) {
                    console.log(data);
                    $scope.companiesObj.push(data);
                    // $scope.success = true;
                    // $state.go('addUsers');
                    var addCompObj = {
                        userId: $scope.currentUser._id,
                        companyId: data._id
                    }
                    $http.post('/addtousersarr', addCompObj)
                        .success(function (data1) {
                            console.log(data1)
                            // $scope.success = true;
                            // $state.go('addUsers');
                        })
                        .error(function (err) {
                            console.log(err)
                            $scope.success = false;
                        })
                })
                .error(function (err) {
                    console.log(err)
                    $scope.success = false;
                });



        }

$scope.goIntoCompany = function(company){
    sessionData.companyId = company._id
    sessionStorage.data = JSON.stringify(sessionData);
    $state.go('addUsers');
}
    })