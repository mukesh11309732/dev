var express = require('express');
var app = exports.app = express();
app.use(express.json())

var isd = require('./routes/isd');
app.get('/leads', isd.listAllLeads);
app.get('/interests', isd.listAllInterests);
app.post('/leads', isd.createLead);

app.listen(2000, function () {
    console.log("Node server is up and running on port 2000");
});