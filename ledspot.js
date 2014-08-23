var ledspot = {}

ledspot.create = function(id, identifier, address, dmx) {
  var spot = {};
  spot.id = id;
  spot.buffer = Array(7);
  spot.isOn = false;
  spot.identifier = identifier;

  spot.updateInterval = setInterval(function() {
    dmx.setChannels(address, spot.buffer);
  }, 20);

  spot.on = function() {
    spot.buffer[6] = 255;
    spot.isOn = true;
  }

  spot.off = function() {
    spot.buffer[6] = 0;
    spot.isOn = false;
  }

  spot.setColor = function(colorArray) {
    if (colorArray.length == 3) {
      spot.buffer[0] = colorArray[0];
      spot.buffer[1] = colorArray[1];
      spot.buffer[2] = colorArray[2];
    } else {
      console.log("[Error] Wrong amount of Channels");
    }
  }

  spot.setStrobe = function(time) {
    if (time == 0) {
      clearInterval(spot.strobeInterval);
    } else {
      if (spot.strobeInterval) {
        clearInterval(spot.strobeInterval);
      }
      spot.strobeInterval = setInterval(function() {
        if (spot.isOn) {
          spot.off();
        } else {
          spot.on();
        }
      }, time);
    }
  }

  return spot;
}

module.exports = ledspot;
