const discord = require("discord.js-light");
const index = require('../index.js');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
        client.user.setActivity(index.ACTIVITY_MESSAGE, {type: index.ACTIVITY_TYPE, url: index.STREAMING_URL});
	},
};
