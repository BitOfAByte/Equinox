const discord = require('discord.js');

module.exports = {
    config: {
        name: "snipe",
        description: "snipes a deleted message!",
        usage: "^snipe",
        category: "moderation",
        accessableby: "Moderators",
        aliases: ["get", "sn"]
    },
    run: async (bot, message, args) => {
        const msg = client.snipes.get(message.channel.id);
        if (!msg) return message.reply("No deleted messages");

        const embed = new discord.MessageEmbed()
            .setAuthor(`Deleted by ${message.author.tag}`, message.author.displayAvatarURL())
            .setDescription(msg.content);

        if (msg.image) embed.setImage(msg.image);

        message.channel.send(embed);
    }
}