/**
*
* Express-Socket-pi server example
* Haochuan Liu
*
**/
/*=========================================
=            Load node modules            =
=========================================*/

var express = require('express'),
    http = require('http'),
    piblaster = require('pi-blaster.js');

/*-----  End of Load node modules  ------*/

/*====================================
=            server setup            =
====================================*/

var app = express();

// listen on port 8000
var server = app.listen(8000);

var io = require('socket.io').listen(server);

// use ./public as static directory
app.use(express.static(__dirname + '/public'));

/*-----  End of server setup  ------*/

/*==============================
=            Route             =
==============================*/

/**
*
* Suppose the IP of pi is 10.0.1.13, when browser goes to http://10.0.1.13/, 
* server will send ./public/index.html to browser.
*
* You can add/change different address, which is the first parameter in app.get().
* For example, you can add:
* 
* app.get('/somename', function(req, res){
*    res.sendfile(__dirname + '/somename.html');
* });
*
* Now when browser goes to http://10.0.1.13/somename, 
* server will send ./public/somename.html to browser
*
**/

app.get('/', function(req, res){
  res.sendfile(__dirname + '/index.html');
});

/*-----  End of Route   ------*/

/*====================================
=            Socket setup            =
====================================*/

/**
*
* io.on('connection', function (socket)
* 
* Add a lisner when a user is connected to the server, the function is a callback,
* which means when there is a connection, excute the function.
*
* socket.on('red', function (data) {
*   console.log(data);
* });
*
* Inside the callback function(socket), we add a lister on the "red" event.
* When the browser send something to the event "red", you can access the data
* from browser, the data is the parameter in the callback function(data).
*
* piblaster.setPwm(22, Number(data.val));
* This is the main function we use to write a value to a specific pin.
* First parameter is the pin number, second is the data (from 0 to 1);
*
* See README.md for more details about how to communicate between front end and back end
*
**/

io.on('connection', function (socket) {
  socket.on('red', function (data) {
    piblaster.setPwm(22, Number(data.val) / 100);
  });
  socket.on('yellow', function (data) {
    piblaster.setPwm(17, Number(data.val) / 100);
  });
  socket.on('green', function (data) {
    piblaster.setPwm(27, Number(data.val) / 100);
  });
});

/*-----  End of Socket setup  ------*/


