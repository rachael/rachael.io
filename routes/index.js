var express = require('express');
var app = express();

app.set('views', __dirname + '/../views');

/* GET home page. */
app.get('/', function(req, res) {
  res.render('index.pug', { title: 'rachael.io' });
});

module.exports = app;
