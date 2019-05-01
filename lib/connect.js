var util = require('util');
var mqtt = require('mqtt');
var handler = require('./handler.js');
var shared = require('./shared.js');
var forwardEvents = require('./forwardEvents');

module.exports = function() {

	return gladys.param.getValues(['MQTT_URL', 'MQTT_USERNAME', 'MQTT_PASSWORD'])
		.spread(function(url, username, password){

			var client = mqtt.connect(url, {
				username: username,
				password: password
			});

			client.on('connect', function () {
				
				// Gladys multi instances
				client.subscribe('gladys/master/#');
				
				// Owntracks topic
				client.subscribe('owntracks/+/+');

				// Sonoff topic
				client.subscribe('stat/+/+');
				
				// Roomba topic
				client.subscribe('roomba/+/+');

				// Custom sensors topic
				gladys.device.get().then( (devices) => {
					for (var i = 0; i < devices.length; i++) {
						if ( devices[i].service === 'mqtt_custom' ) {
							sails.log.info(`${devices[i].id} - ${devices[i].name} <- custom mqtt device found !`);
							gladys.deviceType.getByDevice(devices[i]).then ( (deviceTypes) => {
								for (var i = 0; i < deviceTypes.length; i++) {
									sails.log.info(`MQTT : connect : subscribe to ${deviceTypes[i].identifier}`);
									client.subscribe(deviceTypes[i].identifier);
								} 
							});
						}
					};
				});

				sails.log.info(`Successfully connected to MQTT : ${url}`);
			});

			client.on('error', function(err) {
				sails.log.warn(`Fail to connect to MQTT : ${url}`);
			});

			client.on('message', function (topic, message) {
				sails.log.info(`MQTT : New message in topic ${topic}`);
				handler(topic, message.toString(), client);
			});

			shared.setClient(client);

			// forward events to other Gladys machine
			forwardEvents(client);

			return client;
	  });

};