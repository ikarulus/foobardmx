var ledbar = {}

ledbar.create = function(id, identifier, address, dmx) {
	var bar = {};
	bar.id = id;
	bar.buffer = Array(11);
	bar.isOn = false;
	bar.identifier = identifier;


	bar.updateInterval = setInterval(function() {
		dmx.setChannels(address, bar.buffer);
	}, 20);


	bar.on = function() {
		bar.buffer[0] = 50;
		bar.isOn = true;
	}

	bar.off = function() {
		bar.buffer[0] = 30;
		bar.isOn = false;
	}

	bar.setColor = function(colorArray) {
		if (colorArray.length == 3) {
			bar.buffer[2] = colorArray[0];
			bar.buffer[3] = colorArray[1];
			bar.buffer[4] = colorArray[2];
			bar.buffer[5] = colorArray[0];
			bar.buffer[6] = colorArray[1];
			bar.buffer[7] = colorArray[2];
			bar.buffer[8] = colorArray[0];
			bar.buffer[9] = colorArray[1];
			bar.buffer[10] = colorArray[2];
		} else if (colorArray.length == 9) {
			bar.buffer[2] = colorArray[0];
			bar.buffer[3] = colorArray[1];
			bar.buffer[4] = colorArray[2];
			bar.buffer[5] = colorArray[3];
			bar.buffer[6] = colorArray[4];
			bar.buffer[7] = colorArray[5];
			bar.buffer[8] = colorArray[6];
			bar.buffer[9] = colorArray[7];
			bar.buffer[10] = colorArray[8];
		} else {
			console.log("[Error] Wrong amount of Channels");
		}

	}

	bar.setStrobe = function(time) {
		if (time == 0) {
			clearInterval(bar.strobeInterval);
		} else {
			if (bar.strobeInterval)
				clearInterval(bar.strobeInterval);
			bar.strobeInterval = setInterval(function() {
				if (bar.isOn) {
					bar.off();
				} else {
					bar.on();
				}
			}, time);
		}
	}


	return bar;
}

module.exports = ledbar;