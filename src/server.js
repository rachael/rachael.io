var express = require('express');
var app = module.exports = express();

var path = require('path');

require('rachael-io-common/common')(app);

var routes = require('../routes/index');
var files = require('../routes/files');

app.use(express.static('public'));
app.use('/', routes);
app.use('/', files);

require('rachael-io-common/error-handler')(app);
