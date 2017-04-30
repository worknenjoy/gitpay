'use strict'

var express = require('express');
var app = express();
const loading = require('./loading/loading');
const passport = require('passport');
const passportConfig = require('./config/passport');
const auth = require('./routes/auth/auth');

app.set('port', (process.env.PORT || 5000));

//Angular testing with server
app.use(express.static(__dirname + '/dist/'));

auth.init(app);

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});