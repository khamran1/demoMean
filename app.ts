/// <reference path="typings/tsd.d.ts" />

import {addingUsers} from './mongoschema';

import express = require('express');
import bodyparser = require('body-parser');
import path = require('path');



let app = express();
addingUsers(app);

let staticFilesPath = path.resolve(__dirname, "static");
app.use(express.static(staticFilesPath));
app.use(bodyparser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    let mainFile = path.resolve(__dirname, 'static/index.html')
    res.sendFile(mainFile);
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

app.listen(3000, () => {
    console.log('app is listening on port 3000')
})
