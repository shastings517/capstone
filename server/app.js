require("dotenv").load();

var express = require("express");
var app = express();
var morgan = require("morgan");
var bodyParser = require("body-parser");
var path = require("path");
var routes = require('./routes');
var server = app.listen(3000);
var io = require('socket.io').listen(server);
var twitter = require('./routes/index');
    
exports.io = io;

app.use(morgan("tiny"));
app.use(bodyParser.json());

app.use('/css',express.static(path.join(__dirname, '../client/css')));
app.use('/js',express.static(path.join(__dirname, '../client/js')));
app.use('/templates',express.static(path.join(__dirname, '../client/js/templates')));

app.use('/api/users', routes.users);
app.use('/api/auth', routes.auth);

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});