// Create parameters
module.exports = function(){
	
	var param = {
		name: 'MQTT_URL',
		value: 'mqtt://xxxx.cloudmqtt.com:19692'
	};

	gladys.param.setValue(param);
		
	var param = {
		name: 'MQTT_USERNAME',
		value: '123456'
	};

	gladys.param.setValue(param);
	
	var param = {
		name: 'MQTT_PASSWORD',
		value: '123456'
	};

	return gladys.param.setValue(param);
};
