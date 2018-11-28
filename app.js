const express = require('express');
const app = express();
const port = process.env.PORT || 8081;
const bodyParser = require('body-parser');
const cors = require('cors');
var config = require('./config.js');
var passport = require('passport');
// var passport = require('passport');
// var uberStrategy = require('passport-uber');
// var https = require('https');
// ClientID & ClientSecret for API requests with OAUTH
var clientID = config.ClientID;
var clientSecret = config.ClientSecret;
// ServerID for API requests without OAUTH
var ServerID = config.ServerID;
// sessionSecret used by passport
var sessionSecret = "UBERAPIROCKS" 


// Intialize Mongo Module
require('./models/mongo.js');
require('./models/users.js');


// routes
const authRoutes = require('./routes/auth.routes');
const UberApiRoutes = require('./routes/uber-api.routes');

app.use(cors());
app.options('*', cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(bodyParser.json({ extended: true, limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(passport.initialize());

app.use('/v0.1/', [
  authRoutes,
  UberApiRoutes,
]);

app.listen(port, () => {
  console.error('SKD api on port ' + port + ' :)'); 
});

module.exports = app;
