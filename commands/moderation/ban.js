const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: "ban",
        description: "bans a user from the guild!",
        usage: "^ban <@member>",
        category: "moderation",
        accessableby: "Moderators",
        aliases: ["remove", "banish", "b"]
    },
    run: async (bot, message, args) => {
        const banUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args.slice(1).join(" ")

        if (message.mentions.users.size < 1) return message.reply("You didn't provide a user to ban!");

        if (reason.length < 1) return message.reply(`You must provide a reason to ban ${banUser}`);

        if (banUser.id === '481913243493990400') return message.reply(`${banUser.user.tag} bypassed your command`);


        const b = new MessageEmbed()
            .setAuthor(`${banUser.user.tag}`)
            .addFields({
                name: `Banned member`,
                value: `${banUser.user.tag}`,
                inline: true
            }, {
                name: "Banned by:",
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
            .setThumbnail(banUser.user.displayAvatarURL())
            .setColor("#008b8b");

        message.channel.send(b);

        await banUser.send({
            embed: {
                title: `Dear ${banUser.user.tag}`,
                description: `You have been banned from ${message.guild.name}\n \nBanned by: \n \n${message.author.tag} \n \nreason: ${reason}\n \nDate of ban: ${message.createdAt.toLocaleString()}`,
                color: `#008b8b`
            }
        }).then(async () => {
            banUser.ban(banUser.id).catch(err => {
                console.log(err);
            });
        });
    }
}