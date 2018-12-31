var express = require('express');
var app = exports.app = express();
app.use(express.static('public'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, path, id");
    next();
});

var api = require('./routes/apis');
app.get('/getFileById', api.getFileById);
app.get('/getFileByPath', api.getFileByPath);
app.get('/getFolderContentsByPath', api.getFolderContentsByPath);
app.get('/getFolderContentsById', api.getFolderContentsById);
app.post('/uploadFile', api.uploadFile);

var server = app.listen(2000, function () {
    console.log("Node server is up and running on port 2000");
});