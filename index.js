/*
 * Imports
 */

const discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const fs = require('fs');

require('dotenv').config();

/*
 * Configuration
 */

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const INTENTS = [];

module.exports = {
    ACTIVITY_MESSAGE: "",
    ACTIVITY_TYPE: "", // PLAYING, STREAMING, LISTENING, WATCHING, CUSTOM, COMPETING
    STREAMING_URL: null, // if activity is not streaming, then this needs to be null
}

/*
 * Client initialize
 */

const client = new discord.Client({
  intents: INTENTS,
});

/*
 * Commands
 */

const commands = [];
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(TOKEN);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
    );
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

/*
 * Events
 */

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
   const event = require(`./events/${file}`);
   console.log(`Loading ${event.name}`)
   if (event.once) {
       client.once(event.name, (...args) => event.execute(...args, client));
   } else {
       client.on(event.name, (...args) => event.execute(...args, client));
   }
}

/*
 * Login
 */

client.login(TOKEN);