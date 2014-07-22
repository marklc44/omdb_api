var express = require("express"),
		ejs = require('ejs'),
		expressLayouts = require('express-ejs-layouts'),
		request = require('request');

var app = express();

// set static assets folder also
app.set('layout', 'layout');
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.use('/assets', express.static(__dirname + '/assets'));

// Data
var query;
var omdbUrl = 'http://www.omdbapi.com/?s=';

app.get('/', function(req, res){
  res.render('index');
});

app.get('/search', function(req, res) {
	query = req.query.searchTerm;
	// res.send('search page ' + query);

	request(omdbUrl + query, function(error, response, body) {
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
						{Title: 'No movies Found', Year: ''}
					]
				});
			}
		}
	});

});


app.listen(3000);
