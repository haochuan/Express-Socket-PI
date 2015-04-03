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
    exec = require('child_process').exec,
    bodyParser = require('body-parser'),
    piblaster = require('pi-blaster.js');
    
var Gpio = require('onoff').Gpio;

var RaspiCam = require("../lib/raspicam");

/*-----  End of Load node modules  ------*/

/*====================================
=            server setup            =
====================================*/

var app = express();

// listen on port 8000
var server = app.listen(8000, function() {
    console.log('App is listen to: 8000');
});

var io = require('socket.io').listen(server);

// use ./public as static directory
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var button = new Gpio(24, 'in', 'both');


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

app.get('/led', function(req, res){
  res.sendfile(__dirname + '/public/led.html');
});

app.get('/flappy', function(req, res){
  res.sendfile(__dirname + '/public/bird.html');
});
app.get('/say', function(req, res){
  res.sendfile(__dirname + '/public/say.html');
});
app.get('/video', function(req, res) {
    var camera = new RaspiCam({
      mode: "video",
      output: "./video/video.h264",
      framerate: 15,
      timeout: 5000 // take a 5 second video
    });

    camera.on("started", function( err, timestamp ){
      console.log("video started at " + timestamp );
    });

    camera.on("read", function( err, timestamp, filename ){
      console.log("video captured with filename: " + filename + " at " + timestamp );
    });

    camera.on("exit", function( timestamp ){
      console.log("video child process has exited at " + timestamp );
      res.end();
    });

    camera.start();
});
app.post('/say', function(req, res) {
  console.log(req.body.text);
  exec('say ' + '"' + req.body.text + '"');
  res.redirect('/say');
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
  button.watch(function(err, value) {
      if (value === 0) {
          console.log('jump');
        socket.emit('jump', { is: value });
      }
        
  });
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


