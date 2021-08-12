/*
 * Imports
 */

const discord = require('discord.js-light');

const fs = require('fs');

/*
 * Configuration
 */

const TOKEN = "PUT YOUR BOT TOKEN HERE";
const ALLOW_DM = true;
const ALLOW_BOT_USE_COMMANDS = true;
const PREFIX = "!";
const INTENTS = 0;

const ACTIVITY_MESSAGE = "";
const ACTIVITY_TYPE = ""; // PLAYING, STREAMING, LISTENING, WATCHING, CUSTOM, COMPETING
const STREAMING_URL = null; // if activity is not streaming, then this needs to be null

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

/*
 * Client initialize
 */

const client = new discord.Client({
  makeCache: Discord.Options.cacheWithLimits({
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
  intents: new discord.Intents(INTENTS),
});

/*
 * Commands
 */

client.commands = new discord.Collection();

fs.readdir("./commands/", (err, files) => {
    if (err) console.log(err);

    let jsFiles = files.filter(f => f.split(".").pop() === "js");

    if (jsFiles.length <= 0) {
        return
    }

    jsFiles.forEach((f, i) => {
        let fileGet = require(`./commands/${f}`);
        console.log(`${f} loaded!`);

        client.commands.set(fileGet.help.name, fileGet);
    })
})

client.on('messageCreate', async (msg) => {
  if (msg.author.bot && !ALLOW_BOT_USE_COMMANDS) return;

  if (msg.channel.type === "dm" && !ALLOW_DM) return;

  let messageArray = msg.content.split(" ");
  let command = messageArray[0];

  let arguments = messageArray.slice(1);

  let commands = client.commands.get(command.slice(PREFIX.length));

  if (commands) commands.run(client, msg, arguments)
});

/*
 * Read
 */

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.user.setActivity(ACTIVITY_MESSAGE, {type: ACTIVITY_TYPE, url: STREAMING_URL});
});

client.login(TOKEN);
