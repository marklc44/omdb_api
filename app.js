var express = require("express"),
		ejs = require('ejs'),
		expressLayouts = require('express-ejs-layouts');

var app = express();

// set static assets folder also
app.set('layout', 'layout');
app.set('view engine', 'ejs');

app.use(expressLayouts);

// Data
var query;
var ombdUrl = 'http://www.omdbapi.com/?';

app.get('/', function(req, res){
  res.render('index');
});

app.get('/search', function(req, res) {
	query = req.query.searchTerm;
	res.send('search page ' + query);
})


app.listen(3000);
