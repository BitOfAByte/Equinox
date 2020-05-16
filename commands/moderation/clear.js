module.exports = {
    config: {
        name: "clear",
        description: "deletes x amount of messages!",
        usage: "^clear <number>",
        category: "moderation",
        accessableby: "Moderators",
        aliases: ["cl", "cls"]
    },
    run: async (bot, message, args) => {
        const args2 = message.content.split(' ').slice(1);
        const amount = args2.join(' ');

        if (!amount) return message.reply('You haven\'t given an amount of messages which should be deleted!');
        if (isNaN(amount)) return message.reply('The amount parameter isn`t a number!');

        if (amount > 100) return message.reply('You can`t delete more than 100 messages at once!');
        if (amount < 1) return message.reply('You have to delete at least 1 message!');

        await message.channel.messages.fetch({
            limit: amount
        }).then(messages => {
            message.channel.bulkDelete(messages)
        });
    }
}