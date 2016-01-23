/// <reference path="typings/tsd.d.ts" />

//import {addingUsers} from './mongoschema';

import express = require('express');
import bodyparser = require('body-parser');
import path = require('path');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/userData')

var signinSchema = new mongoose.Schema({
    username: String,
    password: String,
    age: Number,
    email: String,
    company:[],
    role:String,
    date: { type: Date, default: Date.now },
    token: String
})

var companySchema = new mongoose.Schema({
    name:String,
    addedBy:String,
    date: { type: Date, default: Date.now },
    users:[]
})

var dataModel = mongoose.model('user', signinSchema);
var companyModel = mongoose.model('companies', companySchema);

//Data parser and static path
let app = express();
//addingUsers(app);

let staticFilesPath = path.resolve(__dirname, "static");
app.use(express.static(staticFilesPath));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));


//Routes
app.get('/', (req, res) => {
    let mainFile = path.resolve(__dirname, 'static/index.html')
    res.sendFile('static/index.html');
});

//route to get signup data
app.post('/addUser', (req, res) => {
    dataModel.findOne({ email: req.body.email }, function(err, data) {
        if (err) {
            console.log(err)
        }
        else {
            console.log(data)
            return res.json(data);
        }

    })
});


//route to get signin data
app.get('/signup', function(req, res) {
    dataModel.findOne(function(err, data) {
        if (err) {
            console.log(err)
        }
        else {
            console.log(data)
            return res.json(data);
        }

    })
})


//route to save data
app.post('/signup', (req, res) => {
    // var Animal = mongoose.model('Animal', AnimalSchema);
    var user = new dataModel({
        username: req.body.name,
        password: req.body.pass,
        age: req.body.age,
        email: req.body.email,
        date: (new Date().getTime()),
        token: req.body.token,
        company:[],
        role:'Admin'
    });
    user.save(function(err, data) {
        if (err) {
            console.log(err)
        }
        else {
            console.log(data)
        }
        res.json(data)
    })

});

//add company
app.post('/addCompany', (req, res) => {
    // var Animal = mongoose.model('Animal', AnimalSchema);
    var companyAdd = new companyModel({
        name:req.body.name,
        addedBy:req.body.uid,
        date:new Date(),
        users:[]
        
    });
    companyAdd.save(function(err, data) {
        if (err) {
            console.log(err)
        }
        else {
            console.log(data)
        }
        res.json(data)
    })

});


//route to get signin data
app.post('/signin', function(req, res) {
    dataModel.findOne({ username: req.body.username, password: req.body.pass }, function(err, data) {
        if (err) {
            console.log(err)
        }
        else {
            console.log(data)
            return res.json(data);
        }

    })
})

app.post('/dashboard', (req, res) => {
    dataModel.findOne({ token: req.body.token }, function(err, data) {
        if (err) {
            console.log(err)
        }
        else {
            console.log(data)
        }
        res.json(data);
    })

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
app.listen(3000, () => {
    console.log('app is listening on port 3000')
})
