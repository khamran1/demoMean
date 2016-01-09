/// <reference path="typings/tsd.d.ts" />
var mongoose = require('mongoose');
var connection = mongoose.connect('mongodb://localhost:users');
var userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    age: Number,
    createdOn: { type: Date, default: Date.now() }
});
var userModel = mongoose.model('users', userSchema);
function users() {
    return userModel;
}
exports.users = users;
function addingUsers(app) {
    app.post('/insert', function (req, res) {
        console.log(req.body.uName);
        var userX = new userModel({ username: req.body.uName, password: req.body.uPass, age: parseInt(req.body.uAge) });
        userX.save(function (err, success) {
            if (err) {
                res.send("error 01 while adding shit");
            }
            else {
                res.send({ message: "inserted successfully", data: success });
            }
        });
    });
    app.get('/get/:maxAge', function (req, res) {
        var maxAge = parseInt(req.params.maxAge);
        if (!maxAge) {
            res.send({ message: "invalid age" });
            return;
        }
        console.log("Max age " + maxAge);
        userModel.find({ age: { $lte: maxAge } }, function (err, success) {
            if (err) {
                res.send("error 02 while finding");
            }
            else {
                res.send(success);
            }
        });
    });
}
exports.addingUsers = addingUsers;
