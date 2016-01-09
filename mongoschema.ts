/// <reference path="typings/tsd.d.ts" />

var mongoose = require('mongoose');

let connection = mongoose.connect('mongodb://localhost:users')

let userSchema = new mongoose.Schema({
        username: { type: String, required: true },
        password: { type: String, required: true },
        age: Number,
        createdOn: { type: Date, default: Date.now() }
})

let userModel = mongoose.model('users', userSchema)

export function users(){
    return userModel;
}

export function addingUsers(app){
        app.post('/insert',(req,res)=>{
            console.log(req.body.uName)
            let userX = new userModel({username:req.body.uName,password:req.body.uPass,age:parseInt(req.body.uAge)});
            userX.save(function(err,success){
                if(err){
                    res.send("error 01 while adding shit")
                }
                else{
                    res.send({message: "inserted successfully", data: success})
                }
            })
        })
        
        app.get('/get/:maxAge',(req,res)=>{
            var maxAge = parseInt(req.params.maxAge);
            
            if(!maxAge){
                res.send({message:"invalid age"})
                return;
            }
            console.log("Max age " + maxAge);
            userModel.find({age:{$lte: maxAge}},(err,success)=>{
                if(err){
                    res.send("error 02 while finding")
                }
                else{
                    res.send(success)
                }
            })
        })
}