var express = require('express');
var app = express();

// Resume
app.get('/resume', function(req, res, next) {
  res.redirect('/resume.pdf');
});

// vCard
app.get('/vcard', function(req, res, next) {
  res.redirect('/Rachael Passov.vcf');
});

module.exports = app;
