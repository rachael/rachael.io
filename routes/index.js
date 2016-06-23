var express = require('express');
var app = express();

app.set('views', [__dirname + '/../views', __dirname + '/../submodules']);

/* GET home page. */
app.get('/', function(req, res) {
  res.render('index.pug', { title: 'rachael.io' });
});

app.get('/github', function (req, res) {
  res.render('github.pug', { title: 'rachael.github.io', theme: 'github-theme' });
});

/**
 * Routes requests to /angular-dynamic-html to the demo contained in that submodule.
 * Sets appropriate static directories to support demo before rendering.
 * This may not be extensible. Remains to be seen. For now, works for the single demo.
 */
app.get('/angular-dynamic-html', function (req, res) {
  app.use(express.static('submodules/angular-dynamic-html'));
  app.use(express.static('submodules/angular-dynamic-html/demo'));
  res.render('angular-dynamic-html/demo/src/demo.html');
});

module.exports = app;
