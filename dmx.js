var fs = require('fs');

module.exports = function(filename) {
  var controller = {};

  controller.device = fs.createWriteStream('/dev/dmx0');

  controller.buffer = Buffer(513);

  //inititialize buffer
  for (i = 0; i < controller.buffer.length; i++) {
    controller.buffer[i] = 0x00;
  }

  controller.update = setInterval(function() {
    controller.device.write(controller.buffer);
  }, 20);

  controller.setChannel = function(channel, value) {
    if (channel < 1 || channel > 512) {
      console.log("Error Channel out of Bounds!: ", channel);
      return;
    } else {
      if (value < 0 || value > 255) {
        console.log("Error Value out of Bounds!: ", value);
        return;
      } else {
        controller.buffer[channel] = value;
      }
    }
  };

  controller.setChannels = function(offset, array) {
    for (i = 0; i < array.length; i++) {
      controller.setChannel(offset + i, array[i]);
    }
  };

  controller.getChannel = function(channel) {
    return controller.buffer[channel];
  }

  controller.fadeTimers = Array(513);

  controller.fadeTo = function(channel, toValue) {
    console.log("fading channel " + channel + " to: ", toValue)
    clearInterval(controller.fadeTimers[channel]);
    controller.fadeTimers[channel] = setInterval(function() {
      var cur = controller.getChannel(channel);
      if (cur == toValue) {
        clearInterval(controller.fadeTimers[channel]);
        console.log('fade done');
        return;
      }
      var newValue = (cur < toValue) ? (cur + 1) : (cur - 1);
      controller.setChannel(channel, newValue)
    }, 20);
  };

  return controller;

};
