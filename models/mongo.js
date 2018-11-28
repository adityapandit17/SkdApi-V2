const mongoose = require('mongoose');

// var mongoURI = "mongodb://mlab.com:35850/testuserdb";
mongoose.Promise = global.Promise;
const mongoURI = 'mongodb://localhost:27017/Skd-database-test';


const option = {
  // useMongoClient: true,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};

mongoose.connect(mongoURI, option).then(
	() => { console.log('Mongo Server Connected Successfully...!'); },
	(err) => { console.error('Failed to connect to MongoDB:', err.message); 
}
);

// require('./models/users');
