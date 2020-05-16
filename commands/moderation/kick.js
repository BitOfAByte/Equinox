const {
    MessageEmbed
} = require('discord.js');

module.exports = {
    config: {
        name: "kick",
        description: "kicks a member from the guild!",
        usage: "^kick <@member> <reason>",
        category: "moderation",
        accessableby: "Moderators",
        aliases: ["boot", "k"]
    },
    run: async (bot, message, args) => {
        const kickUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args.slice(1).join(" ")

        if (message.mentions.users.size < 1) return message.reply("You didn't provide a user to kick!");

        if (reason.length < 1) return message.reply(`You must provide a reason to kick ${kickUser}`);

        if (kickUser.id === '481913243493990400') return message.reply(`${kickUser.user.tag} bypassed your command`);


        const b = new MessageEmbed()
            .setAuthor(`${kickUser.user.tag}`)
            .addFields({
                name: `Kicked member`,
                value: `${kickUser.user.tag}`,
                inline: true
            }, {
                name: "Kicked by:",
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
            .setThumbnail(kickUser.user.displayAvatarURL())
            .setColor("#008b8b");

        message.channel.send(b);

        await kickUser.send({
            embed: {
                title: `Dear ${kickUser.user.tag}`,
                description: `You have been kicked from ${message.guild.name}\n \nKicked by: \n \n${message.author.tag} \n \nReason: ${reason}\n \nDate of ban: ${message.createdAt.toLocaleString()}`,
                color: `#008b8b`
            }
        }).then(async () => {
            kickUser.kick(kickUser.id).catch(err => {
                console.log(err);
            });
        });
    }
}