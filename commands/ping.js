const discord = require("discord.js-light");

module.exports.run = async(bot, msg, args) => {
    return msg.reply("Pong!")
}

module.exports.help = {
    name: "ping",
}