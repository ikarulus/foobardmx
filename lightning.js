var dmx = require('./dmx.js')('/dev/dmx0');
//var color = require('onecolor');
var ledbar = require('./ledbar.js');
var ledspot = require('./spot.js');

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var lights = [
  ledspot.create(0, "Spot Fe/Kü", 1, dmx),  // Fenster/Küche
  ledspot.create(1, "Spot Fe/Ta", 8, dmx),  // Fenster/Tafel
  ledspot.create(2, "Spot Tü/Ta", 22, dmx),  // Tür/Tafel
  ledspot.create(3, "Spot Tü/Kü", 15, dmx),  // Tür/Küche
  ledbar.create(4, "Bar Fe/Kü", 51, dmx), // Fenster/Küche
  ledbar.create(5, "Bar Fe/Ta", 29, dmx), // Fenster/Tafel
  ledbar.create(6, "Bar Tü/Ta", 40, dmx), // Tür/Tafel
  ledbar.create(7, "Bar Tü/Kü", 62, dmx), // Tür/Küche
];

lights.forEach(function(e) {
  e.on();
  setTimeout(function() {
    e.setColor([255, 0, 0]);
  }, 1000);
  setTimeout(function() {
    e.setColor([0, 255, 0]);
  }, 2000);
  setTimeout(function() {
    e.setColor([0, 0, 255]);
  }, 3000);

  setTimeout(function() {
    e.setColor([0, 0, 0]);
  }, 4000);
  setTimeout(function() {
    e.setColor([255, 255, 255]);
  }, 4200);

  setTimeout(function() {
    e.setColor([0, 0, 0]);
  }, 4400);
  setTimeout(function() {
    e.setColor([255, 255, 255]);
  }, 4600);

  setTimeout(function() {
    e.setColor([0, 0, 0]);
  }, 4800);
  setTimeout(function() {
    e.setColor([255, 255, 255]);
  }, 5000);

  setTimeout(function() {
    e.off();
  }, 5200);
});

app.set('view engine', 'jade');
app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res) {
  res.render('index', {
    pageData: {
      l: lights
    }
  });
});


io.on('connection', function(socket) {
  socket.on('color', function(data) {
    console.log(data);
    if (data.id == 'all') {
      lights.forEach(function(e) {
        e.setColor(data.values);
      });
    } else {
      lights[data.id].setColor(data.values);
    }
  });

  socket.on('preset', function(preset) {
    switch (parseInt(preset)) {
      case 0:
        lights.forEach(function(e) {
          e.on();
        });
        break;
      case 1:
        lights.forEach(function(e) {
          e.off();
        });
        break;
      case 2:
        lights.forEach(function(e) {
          e.setColor([255, 255, 255]);
        });
        break;
      case 3:
        lights[0].setColor([255, 0, 0]);
        lights[1].setColor([255, 255, 0]);
        lights[2].setColor([0, 255, 0]);
        lights[3].setColor([0, 0, 255]);
        lights[4].setColor([255, 255, 0]);
        lights[5].setColor([255, 0, 255]);
        lights[6].setColor([0, 255, 255]);
        lights[7].setColor([255, 0, 255]);
        break;
      case 4:
        lights[7].setColor([255, 0, 0]);
        lights[6].setColor([255, 0, 255]);
        lights[5].setColor([0, 255, 0]);
        lights[4].setColor([0, 0, 255]);
        lights[3].setColor([255, 255, 0]);
        lights[2].setColor([255, 0, 255]);
        lights[1].setColor([0, 255, 255]);
        lights[0].setColor([255, 0, 255]);
        break;
        break;
      case 5:
        lights[4].setColor([255, 0, 0]);
        lights[5].setColor([255, 255, 0]);
        lights[6].setColor([0, 255, 0]);
        lights[7].setColor([0, 0, 255]);
        lights[0].setColor([255, 255, 0]);
        lights[1].setColor([255, 0, 255]);
        lights[2].setColor([0, 255, 255]);
        lights[3].setColor([255, 0, 255]);
        break;
      case 6:
        lights.forEach(function(e) {
          e.setStrobe(20);
        });
        break;
      case 7:
        lights.forEach(function(e) {
          e.setStrobe(0);
        });
        break;
    }
  })
});


server.listen(80);
console.log("READY");
