var express = require('express');
var router = express.Router();

// Resume download
router.get('/resume', function(req, res, next) {
  res.download(__dirname + '/../public/files/resume-2016-06-07.pdf', 'resume-rachael-passov.pdf');
});

// vCard download
router.get('/vcard', function(req, res, next) {
  res.download(__dirname + '/../public/files/Rachael Passov.vcf');
});

module.exports = router;
