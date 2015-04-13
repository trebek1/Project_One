var express = require('express');
var app = express();
var request = require('request');
var db = require('./models');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');

app.set("view engine", "ejs");	
// This defines req.session
app.use(session({
	secret: "secret",
	resave: false,
	save: {
		uninitialize: true
	}
}));

app.use("/", function(req,res,next) {
	req.login = function(user) {
		req.session.userId = user.id;
	};
	req.currentUser = function() {
		return db.User.find(req.session.userId)
		         .then(function(dbUser) {
		         	req.user = dbUser;
		         	return dbUser;
		         });
	};
	req.logout = function() {
		req.session.userId = null;
		req.user = null;
	};
	next();
});

app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/', function(req,res){
	res.render("index", {title: "Hello"});
});


app.get('/login', function(req,res){
	req.currentUser().then(function(user){
		if (user) {
			res.redirect('/profile');
		} else {
			res.render("user/login");
		}
	});
});

app.get('/signup', function(req,res){
	res.render("user/signup");
});

app.post('/login', function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	db.User.authenticate(username,password)
	  .then(function(dbUser){
	  	if(dbUser) {
	  		req.login(dbUser);
	  		res.redirect('/profile');
	  	} else {
	  		res.redirect('/login');
	  	}
	  }); 
});

// GET /user/:id ---> req.params.id
// GET /user -------> req.query.id
// POST /user ------> req.body.id

app.post('/signup', function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	db.User.createSecure(username,password)
	  .then(function(user){
	  	res.redirect('/profile');
	  });
});

app.delete('/logout', function(req,res){
	req.logout();
	res.redirect('/login');
});




app.listen(3000, function(){
	console.log("I'm listening");
});