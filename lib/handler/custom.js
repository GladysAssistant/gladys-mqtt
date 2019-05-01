
module.exports = function(topic, param){

	// If the event is a new device state
	if(param['_type'] && param['_type'] === 'stat') {
		sails.log.info(`MQTT : new custom sensor state: ${param}`);

		// var datetime = new Date(parseInt(param.tst)*1000);
		var data = {
			value : param,
			datetime : new Date()
		};
		//val
		return gladys.deviceState.createByDeviceTypeIdentifier(topic, 'mqtt_custom', data);

	} else {
		return Promise.resolve();
	}

};
