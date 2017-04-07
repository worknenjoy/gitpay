'use strict'

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

//Angular testing with server
app.use(express.static(__dirname + '/myGitPay/dist/'));

//Jade - comments to test the Angular
//======================================================
//app.use(express.static(__dirname + '/public'));

// views is directory for all template files
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');

//app.get('/', function(request, response) {
//  response.render('pages/index');
//});
//======================================================

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});