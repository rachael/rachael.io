var express = require('express');
var app = express();

/* GET home page. */
app.get('/', function(req, res) {
  res.render('index.pug', { title: 'rachael.io' });
});

module.exports = app;
