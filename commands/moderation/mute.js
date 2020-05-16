const discord = require('discord.js');

module.exports = {
    config: {
        name: "mute",
        description: "mutes a member from the guild!",
        usage: "^mute <@member> <reason>",
        category: "moderation",
        accessableby: "Moderators",
        aliases: ["m", "silent"]
    },
    run: async (bot, message, args) => {
        const muteUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args.slice(1).join(" ")
        const muteRole = message.guild.roles.cache.find(r => r.name === 'muted');

        if (message.mentions.users.size < 1) return message.reply("You must provide a user to mute!");

        if (reason.length < 1) return message.reply(`you must provide a reason to mute ${muteUser}`);

        muteUser.roles.add(muteRole);

        const b = new discord.MessageEmbed()
            .setAuthor(`${muteUser.user.tag}`)
            .addFields({
                name: `Muted member`,
                value: `${muteUser.user.tag}`,
                inline: true
            }, {
                name: "Muted by:",
                value: `${message.author.tag}`,
                inline: true
            }, {
                name: "Reason",
                value: `${reason}`,
                inline: true
            }, {
                name: "Date of punishment",
                value: message.createdAt.toLocaleString()
            }, )
            .setThumbnail(muteUser.user.displayAvatarURL())
            .setColor("#008b8b");

        message.channel.send(b);

    }
}