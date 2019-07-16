var Promise = require('bluebird');
var handler = require('./handler/index.js');

module.exports = function(topic, message, client) {
	try{

		sails.log.info(`Gladys MQTT : Received message on topic ${topic}`);

		if(topic.indexOf('gladys/master') >= 0){
			var obj = JSON.parse(message);
			return handler.gladysRemote(topic, obj, client);
		}

		// Owntracks topic
		if(topic.indexOf('owntracks') >= 0) {
			var obj = JSON.parse(message);
			return handler.owntrack(topic, obj);
		}

		// Sonoff topic
		if (topic.indexOf('stat') >= 0) {
			return gladys.device.getByService({service: 'sonoff'})
				.then((devices) => {
					Promise.map(devices, function (device) {
						if (topic.indexOf(device.identifier) >= 0) {
							var obj = message.toString();
							return handler.sonoff(topic, obj);
						}
					});
				});
		}

		// Roomba topic
		if(topic.indexOf('roomba') >= 0) {
			var obj = JSON.parse(message);
			return handler.roomba(topic, obj);
		}
	} catch(e) {
		sails.log.warn(`MQTT : handler : fail to handle incoming message on topic ${topic}`);
		sails.log.warn(e);
	};
};