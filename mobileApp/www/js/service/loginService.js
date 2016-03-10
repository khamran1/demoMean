/**
 * Created by Hamid Ali on 2/12/2016.
 */

app
    .factory('loginService', function ($firebaseArray,$ionicLoading, dateTimeService){

        return{
            logAdmin: function(obj,success,failure){
                var ref = "https://dunnowhat.firebaseio.com/activity/loginActivity/" + dateTimeService.madeTime('').split(' ')[0];
                var messages = $firebaseArray(new Firebase(ref));
                messages.$add(obj).then(function(){
                    success()
                },function(){

                    failure()
                });
            },
            logUser: function(obj,success,failure){
                var ref = "https://dunnowhat.firebaseio.com/activity/loginActivity/" + dateTimeService.madeTime('').split(' ')[0];
                var messages = $firebaseArray(new Firebase(ref));
                messages.$add(obj).then(function(){
                    success()
                },function(){

                    failure()
                });
            },
            auth: function(obj,success,failure){
                var ref = new Firebase("https://dunnowhat.firebaseio.com");
                ref.authWithPassword({
                    "email": obj.email,
                    "password": obj.pass
                }, function(error, authData) {
                    if (error) {

                        $ionicLoading.hide();
                        console.log("Login Failed!", error);
                        failure()
                    } else {
                        success()
                    }
                })
            },
            signUp: function(obj,success,failure){
              var ref = "https://dunnowhat.firebaseio.com/admin";
              var messages = $firebaseArray(new Firebase(ref));
              messages.$add(obj).then(function(){

                success()
              },function(){

                failure()
              });
            },
            signupToken: function(obj,success,failure){


              var ref = new Firebase("https://dunnowhat.firebaseio.com");
              ref.createUser({
                email: obj.email,
                password: obj.pass
              }, function (error, userData) {
                if (error) {
                  failure(error)
                }
                else{
                  success(userData)
                }

              })






            }
        }

    })
