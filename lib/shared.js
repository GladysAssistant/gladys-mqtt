var client = null;

module.exports = {

	getClient: function () {
		if (client === null) {
			return connect();
		}
		return Promise.resolve(client);
	},

	setClient: function (newClient) {
		client = newClient;
	}
};