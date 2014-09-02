var dmx = require('./dmx.js')('/dev/dmx0');
var color = require('onecolor');
var ledbar = require('./ledbar.js');
var ledspot = require('./ledspot.js');

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var lights_by_name = {
  "Sfk": ledspot.create("Sfk", "Spot Fe/Kü", 1, dmx),  // Fenster/Küche
  "Sft": ledspot.create("Sft", "Spot Fe/Ta", 8, dmx),  // Fenster/Tafel
  "Stt": ledspot.create("Stt", "Spot Tü/Ta", 22, dmx),  // Tür/Tafel
  "Stk": ledspot.create("Stk", "Spot Tü/Kü", 15, dmx),  // Tür/Küche
  "Bfk": ledbar.create("Bfk", "Bar Fe/Kü", 51, dmx), // Fenster/Küche
  "Bft": ledbar.create("Bft", "Bar Fe/Ta", 29, dmx), // Fenster/Tafel
  "Btt": ledbar.create("Btt", "Bar Tü/Ta", 40, dmx), // Tür/Tafel
  "Btk": ledbar.create("Btk", "Bar Tü/Kü", 62, dmx), // Tür/Küche
};
var lights = [
  lights_by_name["Sfk"],
  lights_by_name["Sft"],
  lights_by_name["Stt"],
  lights_by_name["Stk"],
  lights_by_name["Bfk"],
  lights_by_name["Bft"],
  lights_by_name["Btt"],
  lights_by_name["Btk"],
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
    if (data.id == 'all') {
      lights.forEach(function(e) {
        e.setColor(data.values);
      });
    } else {
      lights_by_name[data.id].setColor(data.values);
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
        lights_by_name["Sfk"].setColor([255, 0, 0]);
        lights_by_name["Sft"].setColor([255, 255, 0]);
        lights_by_name["Stk"].setColor([0, 255, 0]);
        lights_by_name["Stt"].setColor([0, 0, 255]);
        lights_by_name["Bft"].setColor([255, 255, 0]);
        lights_by_name["Btt"].setColor([255, 0, 255]);
        lights_by_name["Bfk"].setColor([0, 255, 255]);
        lights_by_name["Btk"].setColor([255, 0, 255]);
        break;
      case 4:
        lights_by_name["Btk"].setColor([255, 0, 0]);
        lights_by_name["Bfk"].setColor([255, 0, 255]);
        lights_by_name["Btt"].setColor([0, 255, 0]);
        lights_by_name["Bft"].setColor([0, 0, 255]);
        lights_by_name["Stt"].setColor([255, 255, 0]);
        lights_by_name["Stk"].setColor([255, 0, 255]);
        lights_by_name["Sft"].setColor([0, 255, 255]);
        lights_by_name["Sfk"].setColor([255, 0, 255]);
        break;
      case 5:
        lights_by_name["Bft"].setColor([255, 0, 0]);
        lights_by_name["Btt"].setColor([255, 255, 0]);
        lights_by_name["Bfk"].setColor([0, 255, 0]);
        lights_by_name["Btk"].setColor([0, 0, 255]);
        lights_by_name["Sfk"].setColor([255, 255, 0]);
        lights_by_name["Sft"].setColor([255, 0, 255]);
        lights_by_name["Stk"].setColor([0, 255, 255]);
        lights_by_name["Stt"].setColor([255, 0, 255]);
        break;
      case 6:
        lights_by_name["Bft"].setColor([127, 0, 0]);
        lights_by_name["Btt"].setColor([127, 0, 0]);
        lights_by_name["Bfk"].setColor([127, 0, 0]);
        lights_by_name["Btk"].setColor([127, 0, 0]);
        lights_by_name["Sfk"].setColor([127, 0, 0]);
        lights_by_name["Stk"].setColor([127, 0, 0]);
        lights_by_name["Sft"].setColor([0, 0, 0]);
        lights_by_name["Stt"].setColor([0, 0, 0]);
        break;
      case 998:
        lights.forEach(function(e) {
          e.setStrobe(20);
        });
        break;
      case 999:
        lights.forEach(function(e) {
          e.setStrobe(0);
        });
        break;
    }
  })
});

server.listen(80);
console.log("READY");
