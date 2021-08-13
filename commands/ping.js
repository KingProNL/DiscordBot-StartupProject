const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports.data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Replies with pong!');

module.exports.run = async(interaction) => {
    return await interaction.reply({ content: 'Pong!', ephemeral: true });
}