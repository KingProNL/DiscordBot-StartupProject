/*
 * Imports
 */

const discord = require('discord.js-light');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const fs = require('fs');

/*
 * Configuration
 */

const TOKEN = "PUT YOUR BOT TOKEN HERE";
const CLIENT_ID = "PUT YOUR CLIENT ID HERE";
const INTENTS = [];

const CACHE_CLIENT_CHANNELS = 0;
const CACHE_CLIENT_USERS = 0;

const CACHE_GUILDS = Infinity;
const CACHE_GUILD_CHANNELS = 0;
const CACHE_GUILD_EMOJIS = 0;
const CACHE_GUILD_STICKERS = 0;
const CACHE_GUILD_BANS = 0;
const CACHE_GUILD_INVITES = 0;
const CACHE_GUILD_MEMBERS = 0;
const CACHE_GUILD_PRESENCE = 0;
const CACHE_GUILD_ROLES = 0;
const CACHE_GUILD_STAGES = 0;
const CACHE_GUILD_VOICESTATES = 0;


const CACHE_MESSAGES = 0;
const CACHE_THREADS = 0;
const CACHE_THREADS_MEMBERS = 0;
const CACHE_PERMISSIONOVERWRITES = 0;
const CACHE_MESSAGE_REACTIONS = 0;
const CACHE_REACTIONS_USERS = 0;

module.exports = {
    ACTIVITY_MESSAGE: "",
    ACTIVITY_TYPE: "", // PLAYING, STREAMING, LISTENING, WATCHING, CUSTOM, COMPETING
    STREAMING_URL: null, // if activity is not streaming, then this needs to be null
}

/*
 * Client initialize
 */

const client = new discord.Client({
  makeCache: discord.Options.cacheWithLimits({
      ApplicationCommandManager: 0, // guild.commands
      BaseGuildEmojiManager: CACHE_GUILD_EMOJIS, // guild.emojis
      ChannelManager: CACHE_CLIENT_CHANNELS, // client.channels
      GuildChannelManager: CACHE_GUILD_CHANNELS, // guild.channels
      GuildBanManager: CACHE_GUILD_BANS, // guild.bans
      GuildInviteManager: CACHE_GUILD_INVITES, // guild.invites
      GuildManager: CACHE_GUILDS, // client.guilds
      GuildMemberManager: CACHE_GUILD_MEMBERS, // guild.members
      GuildStickerManager: CACHE_GUILD_STICKERS, // guild.stickers
      MessageManager: CACHE_MESSAGES, // channel.messages
      PermissionOverwriteManager: CACHE_PERMISSIONOVERWRITES, // channel.permissionOverwrites
      PresenceManager: CACHE_GUILD_PRESENCE, // guild.presences
      ReactionManager: CACHE_MESSAGE_REACTIONS, // message.reactions
      ReactionUserManager: CACHE_REACTIONS_USERS, // reaction.users
      RoleManager: CACHE_GUILD_ROLES, // guild.roles
      StageInstanceManager: CACHE_GUILD_STAGES, // guild.stageInstances
      ThreadManager: CACHE_THREADS, // channel.threads
      ThreadMemberManager: CACHE_THREADS_MEMBERS, // threadchannel.members
      UserManager: CACHE_CLIENT_USERS, // client.users
      VoiceStateManager: CACHE_GUILD_VOICESTATES // guild.voiceStates
  }),
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