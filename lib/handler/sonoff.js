module.exports = function (topic, param) {

	// If the event is a new device power state
	if (topic.indexOf('POWER') >= 0) {
		sails.log.info(`MQTT : new sonoff power state: ${param}`);

		var newValue = param === 'ON' ? 1 : 0;
		var identifier = topic.replace(/stat\/(\w+)\/POWER/i, '$1');
		var data = {
			value : newValue,
			datetime : new Date()
		};

		return gladys.deviceState.createByIdentifier(identifier, 'sonoff', 'binary', data);
	} else {
		return Promise.resolve();
	}
};