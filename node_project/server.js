var express				= require('express');
var app 					= express();
var bodyParser		= require('body-parser');
var morgan				= require('morgan');
var mongoose			= require('mongoose');
var jwt 					= require('jsonwebtoken');
var port					= process.env.PORT || 8080;

var superSecret = 'lecodesimplonilesttropcool';

var User = require('./app/models/user');


mongoose.connect('mongodb://localhost:27017/db_node_project');

 // APP CONFIGURATION ---------------------
 // use body parser so we can grab information from POST requests
 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(bodyParser.json());

 // configure our app to handle CORS requests
 app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
 res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \
 	Authorization');
 next();
 });

 app.use(morgan('dev'));
 // ROUTES FOR OUR API
 // =============================

 // basic route for the home page
 app.get('/', function(req, res) {
 res.send('Welcome to the home page!');
 });

 // get an instance of the express router
 var apiRouter = express.Router();

 apiRouter.post('/authenticate', function(req, res, next){
 	// find the user
// select the name username and password explicitly 
	User.findOne({
		username: req.body.username
	}).select('name username password').exec(function(err, user) {
			if (err) throw err;
			    // no user with that username was found
			if (!user) {
			 res.json({
			success: false,
			message: 'Authentication failed. User not found.'
			});
	} else if (user) {
  // check if password matches
var validPassword = user.comparePassword(req.body.password); if (!validPassword) {
  	res.json({
    success: false,
    message: 'Authentication failed. Wrong password.'
		});
	} else {
// if user
// create a token
var token = jwt.sign({
          name: user.name,
          username: user.username
        }, superSecret, {
		expiresIn : 60*60*24
	});

// return the information including token as JSON
	res.json({
	success: true,
	message: 'Enjoy your token!', token: token
				}); 
			}
		}
	});
});


 apiRouter.use(function(req, res, next){
 	console.log('Somebody just came to our app!');
 	next();
 });

 // test route to make sure everything is working
 // accessed at GET http://localhost:8080/api
 apiRouter.get('/', function(req, res) {
 	res.json({ message: 'hooray! welcome to our api!' });
 });

// ----------------------------------------------------

	apiRouter.route('/users')
	        // create a user (accessed at POST http://localhost:8080/api/users)
		.post(function(req, res) {
		// create a new instance of the User model
		var user = new User();
		                // set the users information (comes from the request)
		                user.name = req.body.name;
		                user.username = req.body.username;
		                user.password = req.body.password;
		                // save the user and check for errors
			user.save(function(err) { if (err) {
		                // duplicate entry
			if (err.code == 11000)
				return res.json({ success: false, message: 'A user with that\
			username already exists. '});
			 else
				return res.send(err);
			}
		    res.json({ message: 'User created!' });
		   });
	})
		.get(function(req, res){
				User.find(function(err, users){
						if (err) res.send(err);
						//return the users
						res.json(users);
				});
		});
	apiRouter.route('/users/:user_id')
// get the user with that id
// (accessed at GET http://localhost:8080/api/users/:user_id)
 	.get(function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			if (err) res.send(err);
			// return that user
			res.json(user);
	});
 })
 	.put(function(req, res) {
  	User.findById(req.params.user_id, function(err, user) {
    if (err) res.send(err);
      if (req.body.name) user.name = req.body.name;
      if (req.body.username) user.username = req.body.username;
      if (req.body.password) user.password = req.body.password;
   user.save(function(err) {
		if (err) res.send(err);
			res.json({ message: 'User updated!' });
  		});
 		});
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
 app.use('/api', apiRouter);

 app.listen(port);
 console.log('it works! ' + port);
