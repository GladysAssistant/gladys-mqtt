var handler = require('./handler/index.js');

module.exports = function(topic, message, client) {
	try{

		sails.log.info(`Gladys MQTT : Received message on topic ${topic}`);



		if(topic.indexOf('gladys/master') >= 0){
			var obj = JSON.parse(message);
			return handler.gladysRemote(topic, obj, client);
		} else if(topic.indexOf('owntracks') >= 0) { // Owntracks topic
			var obj = JSON.parse(message);
			return handler.owntrack(topic, obj);
		} else if(topic.indexOf('stat') >= 0) { // Sonoff topic
			gladys.device.getByService({service: 'sonoff'})
				.then(function(devices) {
					devices.forEach(function(device) {
						if(topic.indexOf(device.identifier) >= 0) {
							var obj = message.toString();
							return handler.sonoff(topic, obj);
						}
					});
				});
		} else if(topic.indexOf('roomba') >= 0) { // Roomba topic
			var obj = JSON.parse(message);
			return handler.roomba(topic, obj);
		} else {
			sails.log.info(`MQTT : handler : message for custom sensor (${topic}) : ${message}`);
			return handler.custom(topic, message);
		}
	} catch(e) {
		sails.log.warn(`MQTT : handler : fail to handle incoming message on topic ${topic}`);
		sails.log.warn(e);
	};
};