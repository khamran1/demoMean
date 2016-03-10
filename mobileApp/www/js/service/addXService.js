/**
 * Created by Hamid Ali on 2/14/2016.
 */


app
    .factory('addXService', function ($firebaseArray) {
        return{
            addCompany: function (obj, success) {
                var ref = "https://dunnowhat.firebaseio.com/companies/";
                var ref2 = "https://dunnowhat.firebaseio.com/activity/companeisLog/";
                var ref3 = new Firebase("https://dunnowhat.firebaseio.com/admin");
                var company = $firebaseArray(new Firebase(ref));
                var companylog = $firebaseArray(new Firebase(ref2));
                company.$add(obj).then(function () {
                    companylog.$add(obj).then(function () {
                ref3.orderByChild('id')
                  .equalTo(obj.addedBy)
                  .on('child_added', function (user) {
                    var userX = user.val();

                    //var editUser = userX[Object.keys(userX)[0]];
                    if(userX){
                      var companyName = obj.id;
                      var userRef = user.ref();
                      if(userX.companies){
                        userX.companies[companyName] = true;
                      }else{
                        userX['companies'] = {};
                        userX.companies[companyName] = true;
                      }
                      userRef.update(userX);
                    }

                  })
                        success()
                    }, function () {
                        console.log("Error occured while adding company")
                    })

                }, function () {
                    console.log("Error occured while adding company")
                })
            },
            getLog: function (token, success) {
                var ref = new Firebase("https://dunnowhat.firebaseio.com/admin");

                return $firebaseArray(ref.orderByChild('token').equalTo(token))

            },
            getCompany: function (id, success) {
                var ref = new Firebase("https://dunnowhat.firebaseio.com/companies");

                /*ref.orderByChild('addedBy')
                    .equalTo(id)
                    .on('value', function (item) {
                        success(item.val());
                    })*/
                return $firebaseArray(ref.orderByChild('addedBy').equalTo(id));
            },
            getUserCompany: function (id, success) {
                var ref = new Firebase("https://dunnowhat.firebaseio.com/companies");

                /*ref.orderByChild('addedBy')
                    .equalTo(id)
                    .on('value', function (item) {
                        success(item.val());
                    })*/
                return $firebaseArray(ref.orderByChild('id').equalTo(id));
            },
            addUsers: function (obj,uid, success, failure) {
                var ref = "https://dunnowhat.firebaseio.com/users";
                var ref3 = new Firebase("https://dunnowhat.firebaseio.com/admin");
                var users = $firebaseArray(new Firebase(ref));
                users.$add(obj).then(function () {
                  ref3.orderByChild('id')
                    .equalTo(uid)
                    .on('child_added', function (user) {
                      var userX = user.val();

                      //var editUser = userX[Object.keys(userX)[0]];
                      if(userX){
                        var userId = obj.id;
                        var userRef = user.ref();
                        if(userX.users){
                          userX.users[userId] = true;
                        }else{
                          userX['users'] = {};
                          userX.users[userId] = true;
                        }
                        userRef.update(userX);
                        success()
                      }

                    })

                }, function () {
                    failure()
                })
            },
            getUsers: function (companyId, success) {
                var ref = new Firebase("https://dunnowhat.firebaseio.com/users");
                /*ref
                    .orderByChild('companyId')
                    .equalTo(companyId)
                    .on('value', function (item) {
                        success(item.val())
                    })*/
                return $firebaseArray(ref.orderByChild('companyId').equalTo(companyId));
            },
            getUser: function (id, success) {
                var ref = new Firebase("https://dunnowhat.firebaseio.com/users");
                ref
                    .orderByChild('id')
                    .equalTo(id)
                    .on('value', function (item) {
                        success(item.val())
                    })

            },
            getSingleCompany: function (companyId, success) {
                var ref = new Firebase("https://dunnowhat.firebaseio.com/companies");

                ref.orderByChild('id')
                    .equalTo(companyId)
                    .on('value', function (cmpny) {
                        success(cmpny.val());
                    })
            },
            getProduct: function (companyId) {
                var ref = new Firebase("https://dunnowhat.firebaseio.com/product");

                /*ref.orderByChild('currCompanyId')
                    .equalTo(companyId)
                    .on('value', function (prods) {
                        success(prods.val());
                    })*/
                return $firebaseArray(ref.orderByChild('companyId').equalTo(companyId));
            },
            addProduct: function(prod,adminId, success, failure){
                var ref = "https://dunnowhat.firebaseio.com/product";
                var ref2 = "https://dunnowhat.firebaseio.com/activity/productLog";
                var ref3 = new Firebase("https://dunnowhat.firebaseio.com/admin");
                var productLog = $firebaseArray(new Firebase(ref2));
                var product = $firebaseArray(new Firebase(ref));
                product.$add(prod).then(function(){
                    productLog.$add(prod).then(function(){
                      ref3.orderByChild('id')
                        .equalTo(adminId)
                        .on('child_added', function (user) {
                          var userX = user.val();

                          //var editUser = userX[Object.keys(userX)[0]];
                          if(userX){
                            var prodId = prod.id;
                            var userRef = user.ref();
                            if(userX.products){
                              userX.products[prodId] = true;
                            }else{
                              userX['products'] = {};
                              userX.products[prodId] = true;
                            }
                            userRef.update(userX);
                            success()
                          }

                        })
                    },function(){
                        failure()
                    })
                },function(){
                    failure()
                })
            },
            takeProduct: function(addLog,success){
                var ref = new Firebase("https://dunnowhat.firebaseio.com/product");
                var ref2 = "https://dunnowhat.firebaseio.com/activity/productLog";
                var prodObj = {};
                //var product = $firebaseArray(new Firebase(ref));
                var product2 = $firebaseArray(new Firebase(ref2));
                ref.orderByChild('id')
                    .equalTo(addLog.prodId)
                    .on('child_added', function (prods) {
                        var prodVal = prods.val();
                        var product = prodVal[Object.keys(prodVal)[0]];

                        if(product){
                            var prodRef = prods.ref();
//                            prodObj = prods.val()[Object.keys(prods.val())[0]];
//                            prodObj.quantity = addLog.quantity;
                            prodRef.update({
                                quantity:addLog.quantity
                            },function(){
                                console.log('it worked');
                                product2.$add(addLog)
                                success()
                            })

                        }
                        //success(prods.val());
                    })
            },
            getProdById:function(prodId, success){
              var ref = new Firebase("https://dunnowhat.firebaseio.com/activity/productLog/");
              return $firebaseArray(ref.orderByChild('prodId').equalTo(prodId));
          },
          getProdByUserId:function(userId, success){
              var ref = new Firebase("https://dunnowhat.firebaseio.com/activity/productLog/");
              return $firebaseArray(ref.orderByChild('userId').equalTo(userId));
          }
        }
    });
/* sessionStorage productData
{
    "addedOn": "Sun Feb 28 2016 14:17:45 GMT+0500 (Pakistan Standard Time)",
    "companyId": "56c9dc5f7417b4e406a5db5f",
    "id": "56d2bb3920977d2404842504",
    "ipAddress": "39.50.228.87",
    "lattitude": "24.933847999999998",
    "longitude": "67.10008909999999",
    "name": "oop",
    "quantity": 13,
    "userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.0 Safari/537.36",
    "$id": "-KBb9pd9KsDCox7XvWWU",
    "$priority":null
}*/
