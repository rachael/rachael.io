var express = require('express');
var app = express();

var path = require('path');

var common = require('rachael-io-common/common');
app.use(common);

var routes = require('./routes/index');
var files = require('./routes/files');

app.use(express.static('public'));
app.use('/', routes);
app.use('/', files);

var errorHandler = require('rachael-io-common/error-handler');
app.use(errorHandler);

module.exports = app;
