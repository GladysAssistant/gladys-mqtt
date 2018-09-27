var shared = require('./shared.js');
var client;

module.exports = function emit(topic, value, hasCallback, options) {

    // default params
    options = options || {};
	options.qos = options.qos || 1;
	if(hasCallback == null) hasCallback = false

	client = shared.getClient()

	sails.log.info(`Gladys MQTT - Sending to topic "${topic}"`);

	client.publish(topic, value, options)

	if(hasCallback) return waitResponse(topic)
	else return Promise.resolve()

};

function waitResponse(topicParam){
	return new Promise((resolve, reject) => {
		sails.log.info(`Gladys MQTT - Listening to topic "${topicParam}"`);

		client.subscribe(`${topicParam}`);

		client.on('message', function(topic, message){
			if(topic == topicParam){
				client.unsubscribe(`${topicParam}`);
				resolve({topic: topic, message: message.toString()})
			}
		});

	})
}