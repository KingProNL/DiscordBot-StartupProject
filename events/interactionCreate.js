const index = require('../index.js');
const discord = require('discord.js-light');

const fs = require('fs');

const commands = new discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`../commands/${file}`);

    console.log(`${file} loaded!`);

    commands.set(command.data.name, command);
}

module.exports = {
	name: 'interactionCreate',
	once: false,
	execute (interaction) {
        if (!interaction.isCommand()) return;

        let command = commands.get(interaction.commandName)

        if (command) {
            command.run(interaction);
        }
	},
};