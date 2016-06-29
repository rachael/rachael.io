var express = require('express');
var router = express.Router();

// Resume
router.get('/resume', function(req, res, next) {
  res.redirect('/resume.pdf');
});

// vCard
router.get('/vcard', function(req, res, next) {
  res.redirect('/Rachael Passov.vcf');
});

module.exports = router;
