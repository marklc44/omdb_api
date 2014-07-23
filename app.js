var express = require("express"),
		ejs = require('ejs'),
		expressLayouts = require('express-ejs-layouts'),
		bodyParser = require('body-parser'),
		methodOverride = require('method-override'),
		request = require('request');

var app = express();

// View Engine, Layout, Assets
app.set('layout', 'layout');
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded());
app.use(methodOverride('_method'));

// Data
var query;
var omdbUrl = 'http://www.omdbapi.com/?';
var favorites = [];

// Utils
var showFav = function(movieID) {
	if (favorites.length > 0) {

	}
};

// Routes
app.get('/', function(req, res){
  res.render('index');
});

app.get('/search', function(req, res) {
	query = req.query.searchTerm;

	request(omdbUrl + 's=' + query, function(error, response, body) {
		if(!error && response.statusCode === 200) {
			var body = JSON.parse(body);
			if (body.Search) {
				res.render('results', {
				movies: body.Search,
				query: query,
				faves: favorites
			});
			} else {
				res.render('results', {
					movies: [
						{ Title: 'No movies Found', Year: '' }
					], 
					query: query,
					faves: favorites
				});
			}
		}
	});

});


// get with request to title
app.get('/movies/:id', function(req, res) {
	query = req.params.id;

	request(omdbUrl + 'i=' + query, function(error, response, body) {
		if(!error && response.statusCode === 200) {
			var body = JSON.parse(body);
			console.log("FAVORITES ", favorites);
			if (body) {
				res.render('show', {
				movie: body,
				faves: favorites
			});
			} else {
				res.render('show', {
					movie: [
						{ Title: 'No movies Found', Year: '' }
					], 
					query: query
				});
			}
		}
	});

});

app.post('/favorites', function(req, res) {
	favorites.push(req.body.favorite);
	res.redirect('/favorites');
});

app.get('/favorites', function(req, res) {
	console.log(favorites);
	res.render('favorites', { faves: favorites });
});

app.delete('/favorites/:id', function(req, res) {
	var id = req.params.id;
	var favsIndex;
  favorites.forEach(function(fav, index){
     if(fav.id === id) {
       favsIndex = index;
     }
  });
  favorites.splice(favsIndex, 1);
  res.redirect('/favorites');
});


app.listen(3000);
