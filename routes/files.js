var express = require('express');
var router = express.Router();

// Resume
router.get('/resume', function(req, res, next) {
  res.redirect('/files/resume.pdf');
});

// vCard
router.get('/vcard', function(req, res, next) {
  res.redirect('/files/Rachael Passov.vcf');
});

// Keybase
router.get('/keybase.txt', function(req, res, next) {
  res.redirect('/files/keybase.txt');
});

module.exports = router;
