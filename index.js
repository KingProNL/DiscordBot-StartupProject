const TOKEN = "PUT YOUR BOT TOKEN HERE";
const ALLOW_DM = false;
const ALLOW_BOT_USE_COMMANDS = false;
const PREFIX = "!";

const ACTIVITY_MESSAGE = "";
const ACTIVITY_TYPE = ""; // PLAYING, STREAMING, LISTENING, WATCHING, CUSTOM, COMPETING
const STREAMING_URL = null; // if activity is not streaming, then this needs to be null

const CACHE_GUILDS = true;
const CACHE_CHANNELS = false;
const CACHE_OVERWRITES = false;
const CACHE_ROLES = false;
const CACHE_EMOJIS = false;
const CACHE_PRESENCES = false;
const CACHE_USERS = true;


const discord = require('discord.js-light');

const fs = require('fs');

const client = new discord.Client({
    cacheUsers: CACHE_USERS,
    cacheGuilds: CACHE_GUILDS,
    cacheChannels: CACHE_CHANNELS,
    cacheOverwrites: CACHE_OVERWRITES,
    cacheRoles: CACHE_ROLES,
    cacheEmojis: CACHE_EMOJIS,
    cachePresences: CACHE_PRESENCES
});

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

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.user.setActivity(ACTIVITY_MESSAGE, {type: ACTIVITY_TYPE, url: STREAMING_URL});
});
  
client.on('message', async (msg) => {
if (msg.author.bot && !ALLOW_BOT_USE_COMMANDS) return;

if (msg.channel.type === "dm" && !ALLOW_DM) return;

let messageArray = msg.content.split(" ");
let command = messageArray[0];

let arguments = messageArray.slice(1);

let commands = client.commands.get(command.slice(PREFIX.length));

if (commands) commands.run(client, msg, arguments)

});

client.login(TOKEN);