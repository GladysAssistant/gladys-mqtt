module.exports = function (topic, param) {

	// if the event is a location
	if(param['_type'] && param['_type'] === 'location') {
		var datetime = new Date(parseInt(param.tst)*1000);
		return gladys.location.create({latitude: param.lat, longitude: param.lon, accuracy: param.acc, user: param.tid, datetime: datetime});
	} else {
		return Promise.resolve();
	}

};