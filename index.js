const app = require('./app');
var express = require('express');
var session = require('express-session');
var passport = require('passport');
var uberStrategy = require('passport-uber');
var https = require('https');
var bodyParser = require('body-parser');
var config = require('./config.js');
// Get all auth stuff from config file
// ClientID & ClientSecret for API requests with OAUTH
var clientID = config.ClientID;
var clientSecret = config.ClientSecret;
// ServerID for API requests without OAUTH
var ServerID = config.ServerID;
// sessionSecret used by passport
var sessionSecret = "UBERAPIROCKS" 

app.use(session({
	secret: sessionSecret,
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/client'));
app.set('views', __dirname + '/client/views');
app.set('view engine','ejs');
// bodyparser for handling post data
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// post to show unauthorized request
app.post('/cars', function(request, response) {
  getRequest('/v1/products?latitude='+request.body.start_latitude+'&longitude='+request.body.start_longitude, function(err, res) {
    response.json(res);
  })
})


// use this for an api get request without oauth
function getRequest(endpoint, callback) {
  var options = {
    hostname: "sandbox-api.uber.com",
    path: endpoint,
    method: "GET",
    headers: {
      Authorization: "Token " + ServerID
    }
  }
  var req = https.request(options, function(res) {
    res.on('data', function(data) {
      console.log('data!');
      console.log(JSON.parse(data));
      callback(null, JSON.parse(data));
    })
  })
  req.end();
  req.on('error', function(err) {
    callback(err, null);
  });
}
// _______________ BEGIN PASSPORT STUFF ________________
// Serialize and deserialize users used by passport
passport.serializeUser(function (user, done){
	done(null, user);
});
passport.deserializeUser(function (user, done){
	done(null, user);
});

// define what strategy passport will use -- this comes from passport-uber
passport.use(new uberStrategy({
		clientID: clientID,
		clientSecret: clientSecret,
		callbackURL: "http://localhost:3000/auth/uber/callback"
	},
	function (accessToken, refreshToken, user, done) {
		console.log('user:', user.first_name, user.last_name);
		console.log('access token:', accessToken);
		console.log('refresh token:', refreshToken);
    // THIS IS WHERE YOU WOULD PUT SOME DB LOGIC TO SAVE THE USER
		user.accessToken = accessToken;
		return done(null, user);
	}
));

// login page 
app.get('/login', function (request, response) {
	response.render('login');
});

// get request to start the whole oauth process with passport
app.get('/auth/uber',
	passport.authenticate('uber',
		{ scope: ['profile', 'history', 'history_lite', 'request', 'request_receipt'] }
	)
);

// authentication callback redirects to /login if authentication failed or home if successful
app.get('/auth/uber/callback',
	passport.authenticate('uber', {
		failureRedirect: '/login'
	}), function(req, res) {
    res.redirect('/');
  });

// home after the user is authenticated
app.get('/', ensureAuthenticated, function (request, response) {
	response.render('index');
});

// /profile API endpoint
app.get('/profile', ensureAuthenticated, function (request, response) {
	getAuthorizedRequest('/v1/me', request.user.accessToken, function (error, res) {
		if (error) { console.log(error); }
		response.json(res);
	});
});

// /history API endpoint
app.get('/history', ensureAuthenticated, function (request, response) {
	getAuthorizedRequest('/v1.2/history', request.user.accessToken, function (error, res) {
		if (error) { console.log("err", error); }
    console.log(res);
		response.json(res);
	});
});

// ride request API endpoint
app.post('/request', ensureAuthenticated, function (request, response) {
	// NOTE! Keep in mind that, although this link is a GET request, the actual ride request must be a POST, as shown below
	var parameters = {
		start_latitude : request.body.start_latitude,
		start_longitude: request.body.start_longitude,
		end_latitude: request.body.end_latitude,
		end_longitude: request.body.end_longitude,
    product_id: "a1111c8c-c720-46c3-8534-2fcdd730040d"
    // product_id: "86b2aff2-9d98-417f-8cf6-c2eb9ffae062"
	};

	postAuthorizedRequest('/v1/requests', request.user.accessToken, parameters, function (error, res) {
		if (error) { console.log(error); }
		response.json(res);
	});
});

// logout
app.get('/logout', function (request, response) {
	request.logout();
	response.redirect('/login');
});

// route middleware to make sure the request is from an authenticated user
function ensureAuthenticated (request, response, next) {
  console.log('inside ensure Authenticated');
	if (request.isAuthenticated()) {
		return next();
	}
	response.redirect('/login');
}
// use this for an api get request
function getAuthorizedRequest(endpoint, accessToken, callback) {
  var options = {
    hostname: "sandbox-api.uber.com",
    path: endpoint,
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken
    }
  }
  var req = https.request(options, function(res) {
    res.on('data', function(data) {
      console.log('data!');
      console.log(JSON.parse(data));
      callback(null, JSON.parse(data));
    })
  })
  req.end();
  req.on('error', function(err) {
    callback(err, null);
  });
}
// use this for an api post request
function postAuthorizedRequest(endpoint, accessToken, parameters, callback) {
  var options = {
    hostname: "sandbox-api.uber.com",
    path: endpoint,
    method: "POST",
    headers: {
      Authorization: "Bearer " + accessToken,
      'Content-Type': 'application/json'
    }
  }
  var req = https.request(options, function(res) {
    res.on('data', function(data) {
      console.log('data!');
      console.log(JSON.parse(data));
      callback(null, JSON.parse(data));
    })
  })
  req.write(JSON.stringify(parameters));
  req.end();
  req.on('error', function(err) {
    callback(err, null);
  });
}


