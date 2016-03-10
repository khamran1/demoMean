/// <reference path="typings/tsd.d.ts" />
//import {addingUsers} from './mongoschema';
var express = require('express');
var bodyparser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://salesman:salesman1@ds011248.mlab.com:11248/salesman');
var signinSchema = new mongoose.Schema({
    username: String,
    password: String,
    age: Number,
    email: String,
    company: [],
    products: [],
    users: [],
    role: String,
    date: { type: Date, default: Date.now },
    token: String
});
var companySchema = new mongoose.Schema({
    name: String,
    addedBy: String,
    date: { type: Date, default: Date.now },
    users: [],
    product: []
});
var usersSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String,
    password: String,
    role: String,
    companyId: String,
    companies: [],
    product: String
});
var productSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    addedBy: String,
    companyId: String,
    addedOn: String,
    lattitude: String,
    longitude: String
});
var productActivitySchema = new mongoose.Schema({
    productName: String,
    quantity: Number,
    userId: String,
    companyId: String,
    getProductonTime: String,
    address: String,
    shopName: String,
    lattitude: String,
    longitude: String
});
var dataModel = mongoose.model('user', signinSchema);
var companyModel = mongoose.model('companies', companySchema);
var userModel = mongoose.model('companyUsers', usersSchema);
var productModel = mongoose.model('products', productSchema);
var activityModel = mongoose.model('activities', productActivitySchema);
//Data parser and static path
var app = express();
//addingUsers(app);
app.set('port', process.env.PORT || 3000);
var staticFilesPath = path.resolve(__dirname, "mobileApp");
app.use(express.static(staticFilesPath));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
//Routes
app.get('/', function (req, res) {
    var mainFile = path.resolve(__dirname, 'mobileApp/www/index.html');
    res.sendFile(mainFile);
});
//route to get signup data
app.post('/addUser', function (req, res) {
    dataModel.findOne({ email: req.body.email }, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(data);
            return res.json(data);
        }
    });
});
//route to get signin data
app.get('/signup', function (req, res) {
    dataModel.findOne(function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(data);
            return res.json(data);
        }
    });
});
function emailQuerry2(email) {
    dataModel.findOne({ email: email }, function (err, data) {
        if (err) {
            return true;
        }
        else {
            if (data == null) {
                return true;
            }
            if (data != null) {
                return false;
            }
        }
    });
}
//route to save data
app.post('/signup', function (req, res) {
    /* var emailExist = emailQuerry2(req.body.email);
 
     if (emailExist) {*/
    var user = new dataModel({
        username: req.body.name,
        password: req.body.pass,
        age: req.body.age,
        email: req.body.email,
        date: (new Date().getTime()),
        token: req.body.token,
        company: [],
        role: 'Admin'
    });
    user.save(function (err, data) {
        if (err) {
            console.log(err);
            res.send('error in sign up. Please sign up again');
        }
        else {
            console.log(data);
            res.json(data);
        }
    });
    // }
    // else {
    //     res.send('user existed')
    // }
});
//add company
app.post('/addCompany', function (req, res) {
    // var Animal = mongoose.model('Animal', AnimalSchema);
    var companyAdd = new companyModel({
        name: req.body.name,
        addedBy: req.body.uid,
        date: new Date(),
        users: []
    });
    companyAdd.save(function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(data);
            return res.json(data);
        }
    });
});
//get company
app.get('/addCompany', function (req, res) {
    companyModel.find(function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(data);
            return res.json(data);
        }
    });
});
//add company to users array
app.post('/getCompanies', function (req, res) {
    companyModel.find({ addedBy: req.body.userId }, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            if (data != null) {
                return res.json(data);
            }
        }
    });
});
function emailQuerry(obj) {
    userModel.findOne({
        $or: [
            {
                email: obj.email
            },
            {
                companyId: obj.companyId
            }
        ]
    }, function (err, data) {
        if (err) {
            return false;
        }
        else {
            if (data == null) {
                return true;
            }
            if (data != null) {
                return false;
            }
        }
    });
}
app.post('/addUsersToArr', function (req, res) {
    userModel.update({ _id: req.body.adminId }, { $addToSet: { users: req.body.userId } }, function (err, data) {
        if (err) {
            res.send('something went wrong while adding user');
        }
        else {
            if (data != null) {
                res.json(data);
            }
        }
    });
});
//get user's company
app.post('/getUsersCompany', function (req, res) {
    companyModel.findOne({ _id: req.body.companyId }, function (err, company) {
        if (err) {
            res.send('not yet joined any company or fired from company');
        }
        else {
            console.log(company);
            res.json(company);
        }
    });
});
//to add users in company user's array
app.post('/addCompanyUsers', function (req, res) {
    var newuser = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.pass,
        role: 'user',
        companyId: req.body.companyId
    });
    // var updateObj = {
    //     companyId: req.body.companyId
    // }
    // var emailExisted = emailQuerry({email: req.body.email, companyId: req.body.companyId})
    // if (emailExisted) {
    // res.send('error in it worked !YAYS')
    newuser.save(function (err, data) {
        if (err) {
            console.log(err);
            res.send('error in adding user');
        }
        else {
            if (data != null) {
                // updateObj.userId = data._id;
                // var compArr = updateUserArr(updateObj)
                // if(compArr){
                return res.json(data);
            }
        }
    });
    //    }
    //     else {
    //             res.send('error in adding user already existed')
    //     }
    // companyModel.update(
    //     { _id:req.body.companyId },
    //     {$addToSet:{users:req.body.userId}},
    //     function(err,data){
    //         if(err){
    //             console.log(err)
    //         }
    //         else{
    //             if(data != null){
    //                 console.log(data)
    //                 return res.json(data)
    //             }
    //         }
    //     }
    // )
});
//get specific company users only
app.post('/getAllCompanyUsers', function (req, res) {
    userModel.find({ companyId: req.body.id }, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            if (data != null) {
                console.log(data);
                return res.json(data);
            }
        }
    });
});
//get signin user
app.post('/getUser', function (req, res) {
    userModel.findOne({ _id: req.body.userId }, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            if (data != null) {
                return res.json(data);
            }
        }
    });
});
app.post('/addToCompArr', function (req, res) {
    dataModel.update({ _id: req.body.userId }, { $addToSet: { company: req.body.companyId } }, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(data);
            return res.json(data);
        }
    });
});
app.post('/addToProductArr', function (req, res) {
    dataModel.update({ _id: req.body.adminId }, { $addToSet: { products: req.body.prodId } }, function (err, data) {
        if (err) {
            res.json('there seems to be an error while adding product');
        }
        else {
            if (data != null) {
                console.log(data);
                res.send(data);
            }
        }
    });
});
//adding product
app.post('/addProduct', function (req, res) {
    var product = new productModel({
        name: req.body.name,
        quantity: req.body.qty,
        addedBy: req.body.userId,
        companyId: req.body.companyId,
        addedOn: req.body.dateNow,
        lattitude: req.body.latt,
        longitude: req.body.longg
    });
    product.save(function (err, prod) {
        if (err) {
            res.send('error occured while saving product');
        }
        else {
            console.log(prod);
            res.json(prod);
        }
    });
});
//get product
app.post('/getProduct', function (req, res) {
    productModel.find({ companyId: req.body.userId }, function (err, prods) {
        if (err) {
        }
        else {
            console.log(prods);
            res.json(prods);
        }
    });
});
//user gets quantity of product
app.post('/userGetsProduct', function (req, res) {
    productModel.update({ _id: req.body._id }, { $set: { quantity: req.body.quantity } }, function (err, data) {
        if (err) {
            res.json('something went wrong while adding quantity');
        }
        else {
            //res.json('success')
            console.log(data);
            var activity = new activityModel({
                productName: req.body.name,
                quantity: req.body.quantity,
                userId: req.body.addedBy,
                companyId: req.body.companyId,
                getProductonTime: req.body.getProdTime,
                address: req.body.address,
                shopName: req.body.shopName,
                lattitude: req.body.lattitude,
                longitude: req.body.longitude
            });
            activity.save(function (err, activity) {
                if (err) {
                    res.send('error finding/editting data');
                }
                else {
                    if (activity != null) {
                        console.log(activity);
                        res.send(activity);
                    }
                }
            });
        }
    });
    // var activity = new activityModel({
    //     productName: req.body.name,
    //     quantity: req.body.quantity,
    //     userId: req.body.addedBy,
    //     companyId: req.body.companyId,
    //     getProductonTime: req.body.getProdTime,
    //     address: req.body.address,
    //     shopName: req.body.shopName,
    //     lattitude: req.body.lattitude,
    //     longitude: req.body.longitude
    // })
    // activity.save(function(err,activity){
    //     if(err){
    //         res.send('error finding/editting data')
    //     }else{
    //         if(activity){
    //             console.log(activity);
    //             res.send(activity);
    //         }
    //     }
    // })
});
//user sign in 
app.post('/usersignin', function (req, res) {
    userModel.findOne({ email: req.body.email, password: req.body.pass }, function (err, data) {
        if (err) {
            res.send('username or email is incorrect');
        }
        else {
            console.log(data);
            return res.json(data);
        }
    });
});
//route to get signin data
app.post('/signin', function (req, res) {
    dataModel.findOne({ email: req.body.email, password: req.body.pass }, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(data);
            return res.json(data);
        }
    });
});
app.post('/dashboard', function (req, res) {
    dataModel.findOne({ token: req.body.token }, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(data);
        }
        res.json(data);
    });
});
app.use(errorHandler3);
function errorHandler3(err, req, res, next) {
    res.send("<h2 style = 'color: red;'>" + err + "</h2>");
}
// app.get('/h', (req, res)=> {
//     let helloFile = path.resolve(__dirname, './static/hello.html')
//     res.sendFile(helloFile);
// });
// app.get('/about', (req, res)=> {
//     let aboutFile = path.resolve(__dirname,'static/about.html')
//     res.sendFile(aboutFile);
// });
//App listener 
app.listen(app.get('port'), function () {
    console.log('app is listening on port ' + app.get('port'));
});
