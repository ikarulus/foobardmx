var fs = require('fs');

var buf = Buffer(513);
//var fd = fs.open('/dev/dmx0', 'w');
var fd = fs.createWriteStream('/dev/dmx0');

var modes = [
  [0,0,0,0,0,0,0,0,0,0,0], //off
  [140, 240,0,0,0,0,0,0,0,0,0], //strobo red
  [170, 10,255,0,0,0,0,0,0,0,0], //farbwechsel
  [250, 10,255,0,0,0,0,0,0,0,0], //fade
  [230, 41,0,0,0,0,0,0,0,0,0], //rainbow
];

function update() {
  for (var i = 0; i < devices.length; i++) {
    var offset = devices[i].address;
    var mode = modes[devices[i].mode];
    for (var j = 0; j < mode.length; j++) {
      buf[offset + j] = mode[j];
    }
  }
}

for (i = 0; i < 513; i++) {
  buf[i] = 0x00;
}

//setInterval(function() {
//    update();
//}, 50);

setInterval(function() {
  update();
  fd.write(buf);
}, 10);
