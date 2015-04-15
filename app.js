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

// app.get("/", function(req,res,next){
// 	var player;
// 	function onYouTubeIframeAPIReady() {
// 	  player = new YT.Player('player', {
	    
// 	    videoId: 'M7lc1UVf-VE',
// 	    events: {
// 	      'onReady': onPlayerReady,
// 	      'onStateChange': onPlayerStateChange
// 	    }
// 	  });
// 	}
// });

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


app.get('/profile', function(req,res){
	// fetch user's years and pass to view
	var year = req.body; 
	console.log(year); 
	req.currentUser().then(function(dbUser){
		if (dbUser) {
			console.log(dbUser); 
			res.render('user/profile', {Batman: dbUser.username, Year: year});
		} else {
			res.redirect('login');
		}
	});
}); 


app.post('/profile', function(req,res){
	console.log("Hello from profile post route")
	// create year with req.body

	var year = req.body.year; 
	console.log(year); 

	db.Year.year = year;
	
	console.log("STARWARS",db.Year.year);

	req.currentUser().then(function(dbUser){
		res.render('year', {Batman: dbUser.username, Byear: year});
		});
	});

app.get('/:year', function(req, res) {
	// do api call
	// render view with api results
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
	console.log('starcraft');
	res.redirect('/');
	console.log('starcraft II'); 
});


//Using the OMDB API to search for movies 

// app.get('/songs',function(req,res){
// 	var song = req.query.q3;
//  var artist = 
// 	if (!movieSearch) {
// 		res.render("search", {movies: [], noMovies: true});
// 	} else {
// 		var url = "http://www.omdbapi.com?s="+movieSearch;

// 		request(url, function(err, resp, body){
// 			console.log("I'm in here 2");
// 			if (!err && resp.statusCode === 200) {
// 				console.log("I'm in here 3");
// 				var jsonData = JSON.parse(body);
// 				if (!jsonData.Search) {
// 					res.render("search", {movies: [], noMovies: true});
// 				}
// 				res.render("search", {movies: jsonData.Search, noMovies: false});
// 			}
// 		});
// 	}
// });


// form where movie title was recieved 
// <form class="myForm" method="GET" action="/search">
// 					<input type="text" name="q3" placeholder="Search">
// 					<button>Click me</button>
// 				</form>


// Where each favorite is printed to the screen
// <ul>
// 			<% idk.forEach(function(fav){ %>
// 				<li>
// 					imdbID: <%= fav.imdbID %>
					

					
// 				</li>
// 			<% }) %>
// 		</ul>

//idk is defined here 

// app.get('/profile', function(req,res){
// 	req.currentUser().then(function(dbUser){
// 		if (dbUser) {
// 			db.FavoriteMovie.findAll({where: {UserId: dbUser.id}})
// 			  .then(function(movies){
// 			  	console.log("\n\n\n\n\nHELLO", movies);
// 			  	console.log("STARCRAFT STARCRAFT STARCRAFT"); 
// 			  	console.log(dbUser); 
// 				res.render('user/profile', {foo: dbUser, idk: movies});
// 			});
// 		} else {
// 			res.redirect('/login');
// 		}
// 	});
// });

app.listen(process.env.PORT || 3000);










