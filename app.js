/// <reference path="typings/tsd.d.ts" />
var express = require('express');
var path = require('path');
var app = express();
// app.set('views',path.resolve(__dirname,'public'))
// app.set('view engine',"ejs")
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
    //__dirname : It will resolve to your project folder.
});
app.get('/h', function (req, res) {
    res.sendFile('static/hello.html');
});
;
app.get('/about', function (req, res) {
    res.sendFile(path.join(__dirname + '/about.html'));
});
app.listen(3000, function () {
    console.log('app is listening on port 3000');
});
