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
	req.currentUser().then(function(user,box){
		if (user) {
			// db.Year.findAll({ include: user }, function(years) {
			// 	res.render('user/profile', { user: user.username, years: years });
			// });

			user.getYears().then(function(years) {
				res.render('user/profile', { username: user.dataValues.username, years: years });
			});
		} else {
			res.redirect('login');
		}
	});
});


app.post('/profile', function(req,res){
	console.log("Hello from profile post route")
	// create year with req.body

	var year = req.body.year;

	db.Year.create({year: year, UserId: req.session.userId });
	
	// var box = [];

	// box.push(year);

	// console.log( "THIS IS BOX", box);
	// req.currentUser().then(function(dbUser){
	// 	res.render('user/profile', {Batman: dbUser.username, Year: box});
	// });
	res.redirect('/profile');
});

//app.get('year', function(req, res) {
	// do api call
	// render view with api results

	//GET https://www.googleapis.com/youtube/v3/search?part=snippet&q=hot+100+number+1+hits+WATEVERYEARISSELECTED&type=playlist&key={YOUR_API_KEY} PLAYJUSTTHEFIRSTQUERY

// API KEY : API key	AIzaSyDmbWcViqYeOyx0Kqsqx_Ewl0MMeZF0I3w
// O AUTH : Client ID	673212558373-iig5j03u1j7gs1a6b1j50o1a282eikbd.apps.googleusercontent.com


// request URL:: GET https://www.googleapis.com/youtube/v3/channels?part=contentDetails
//                                                  &mine=true

// create playlist 

// POST {base_URL}/playlists?part=snippet
//  Request body:
//   {
//     'snippet': {
//       'title': 'New playlist', 
//       'description': 'Sample playlist for Data API',
//      }
//   }

//Add video to a playlist 

// POST {base_URL}/playlistItems?part=snippet
//   Request body:
//   {
//     'snippet': {
//       'playlistId': '{PLAYLIST_ID}', 
//       'resourceId': {
//           'kind': 'youtube#video',
//           'videoId': '{VIDEO_ID}'
//         }
//      'position': 0
//       }
//    }

// // });


// GET REQUEST FROM BEFORE 

// app.get('/movie', function(req,res){
// 	var imdbID = req.query.id;

// 	var url = 'http://www.omdbapi.com?i='+imdbID;
// 	request(url, function(err, resp, body){
// 		if (!err && resp.statusCode === 200) {
// 			var banana = JSON.parse(body);
// 						console.log(banana);
// 			res.render("movie", {movie: banana});	
// 		}
// 	});
// });

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

app.get('/years/:year', function(req, res) {
	var year = req.params.year;
	var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=hot+100+number+1+hits+";
	url += year;
	url += "&type=playlist&key=AIzaSyDmbWcViqYeOyx0Kqsqx_Ewl0MMeZF0I3w";

	request(url, function(err, response, body) {
		var results = JSON.parse(body).items;

		res.render('user/year', { results: results });
	});
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










