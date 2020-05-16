const { Client, Collection } = require("discord.js");
const { token } = require("./botconfig.json");
const bot = new Client();
const { VultrexDB } = require('vultrex.db');


const db = new VultrexDB({
    provider: "sqlite",
    table: "main",
    fileName: "main"
});

db.connect().then(async () => {
    
    ["aliases", "commands"].forEach(x => bot[x] = new Collection());
    ["console", "command", "event"].forEach(x => require(`./handlers/${x}`)(bot));
    
    client.snipes = new Map();
    bot.login(token);
})