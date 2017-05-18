'use strict'

const express = require('express');
const app = express();
const session = require('express-session')
const bodyParser = require('body-parser');
const loading = require('./loading/loading');
const passport = require('passport');
const passportConfig = require('./config/passport');
const auth = require('./modules/auth/auth');
var pg = require('pg');

if (process.env == 'production') {
  pg.defaults.ssl = true;
}

pg.connect(process.env.DATABASE_URL, function(err) {
  if (err) throw err;
  console.log('Connected to postgres!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

app.set('port', (process.env.PORT || 5000));

//Angular testing with server
app.use(express.static(__dirname + '/dist/'));

auth.init(app);

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});

module.exports = app
