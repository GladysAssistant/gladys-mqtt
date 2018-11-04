var shared = require('./shared.js');
let uuid = require('uuid').v4()
var client;

module.exports = function emit(topic, value, hasCallback, options) {

    // default params
    options = options || {};
	options.qos = options.qos || 1;
	if(hasCallback == null) hasCallback = false

	client = shared.getClient()

	topic = topic.toLowerCase()

	sails.log.info(`Gladys MQTT - Sending to topic "${topic}"`);

	value = JSON.parse(value)

	value.callback = {
		hasCallback: hasCallback,
		answerUUID: uuid
	}

	client.publish(topic, JSON.stringify(value), options)

	if(hasCallback) return waitResponse(topic)
	else return Promise.resolve()

};

function waitResponse(topicParam){
	return new Promise((resolve, reject) => {

		topicParam = topicParam + "/answer/" + uuid

		sails.log.info(`Gladys MQTT - Waiting answer to topic "${topicParam}"`);

		client.subscribe(`${topicParam}`);

		var timeout = setTimeout(() => {
			client.unsubscribe(`${topicParam}`)
			reject("Gladys MQTT - The module did not answer in the allotted time")
		}, 30000)

		client.on('message', function(topic, message){
			if(topic == topicParam){
				clearTimeout(timeout)
				client.unsubscribe(`${topicParam}`);
				resolve({topic: topic, message: message.toString()})
			}
		});

	})
}