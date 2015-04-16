var express = require('express');
var app = express();
var request = require('request');
var db = require('./models');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.set("view engine", "ejs");	

// Here's the session (req.session)
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

app.get('/', function(req,res){
	res.render("index");
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

app.get('/profile', function(req,res){
	req.currentUser().then(function(user){
		if (user) {
			user.getYears().then(function(years) {
				res.render('user/profile', { username: user.dataValues.username, years: years });
			});
	    }else{
			res.redirect('login');
		}
	});
});

app.post('/profile', function(req,res){
	var year = req.body.year;
	if(year){
	db.Year.create({year: year, UserId: req.session.userId })};
	


	res.redirect('/profile');
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
	res.redirect('/');
});

app.get('/years/:year', function(req, res) {
	var year = req.params.year;
	var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=hot+100+hits+year+end+";
	url += year;
	url += "&type=playlist&key=AIzaSyDmbWcViqYeOyx0Kqsqx_Ewl0MMeZF0I3w";

	request(url, function(err, response, body) {
		var results = JSON.parse(body).items;

		res.render('user/year', { results: results });
	});
});

app.listen(process.env.PORT || 3000);










