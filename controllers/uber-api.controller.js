// const mongoose = require('mongoose');

var passport = require('passport');
var uberStrategy = require('passport-uber');
var https = require('https');
var config = require('../config.js');
var ServerID = config.ServerID;
var clientID = config.ClientID;
var clientSecret = config.ClientSecret;
// ServerID for API requests without OAUTH
// sessionSecret used by passport
var sessionSecret = "UBERAPIROCKS" 


const UberApiController = {
    
    availableCars: (function(req, res) {
        getRequest('/v1/products?latitude='+req.body.start_latitude+'&longitude='+req.body.start_longitude, function(err, respond) {
            return res.json(respond);
        })
        
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
    }),
    
    uberLogin: (function(res,req){
        
    }),
    
    getAuth: (function(req,res){
        passport.authenticate('uber',
		{ scope: ['profile', 'history', 'history_lite', 'request', 'request_receipt'] }
        )
    })
    
}

module.exports = UberApiController;
