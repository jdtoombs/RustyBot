const Discord = require("discord.js")
const client = new Discord.Client()
require('dotenv').config()

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", msg => {
    if (msg.content === "kopa") {
        msg.reply("cetic");
    }
})

client.login(process.env.TOKEN)