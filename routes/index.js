var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index.pug', { title: 'rachael.io' });
});

router.get('/aligncommerce', function(req, res) {
  res.render('align.pug', { title: 'Hi Align Commerce' });
});

module.exports = router;
