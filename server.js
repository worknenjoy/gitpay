'use strict'

const express = require('express');
const cors = require('cors');
const app = express();
const session = require('express-session')
const bodyParser = require('body-parser');
const loading = require('./loading/loading');
const passport = require('passport');
const passportConfig = require('./config/passport');
const auth = require('./modules/auth/auth');
const feed = require('feed-read');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/frontend/public/'));

app.get('/octos', function (req, res) {

    feed("http://feeds.feedburner.com/Octocats", (err, articles) => {
        if (err) throw err;

        console.log(articles);

    });

    return res.json({

    }).end();
});

auth.init(app);

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});

module.exports = app
