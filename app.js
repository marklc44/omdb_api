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

// Data
var query;
var omdbUrl = 'http://www.omdbapi.com/?';
var favorites = [];

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
				query: query
			});
			} else {
				res.render('results', {
					movies: [
						{ Title: 'No movies Found', Year: '' }
					], 
					query: query
				});
			}
		}
	});

});

// get with request to title
app.get('/movies/:id', function(req, res) {
	query = req.params.id;
	console.log(query);

	request(omdbUrl + 'i=' + query, function(error, response, body) {
		if(!error && response.statusCode === 200) {
			var body = JSON.parse(body);
			if (body) {
				res.render('show', {
				movie: body
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
	favorites.push(req.body.movie);
	res.redirect('/favorites');
});

app.get('/favorites', function(req, res) {
	res.render('favorites', { faves: favorites });
});

app.delete('/favorites', function(req, res) {

});


app.listen(3000);
