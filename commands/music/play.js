const { Utils } = require("erela.js")
const discord = require("discord.js")

module.exports = {
    config: {
        name: "play",
        description: "Play a song/playlist or search for a song from youtube",
        usage: "<input>",
        category: "music",
        accessableby: "Member",
        aliases: ["p", "pplay"]
    },
    run: async (bot, message, args) => {
        const {
            channel
        } = message.member.voice;
    
        if (channel) {
            const player = bot.music.players.spawn({
                guild: message.guild,
                textChannel: message.channel,
                voiceChannel: channel
            });
            if (!args[0]) return message.channel.send("Please provide a song name or link to search.");
    
            bot.music.search(args.join(" "), message.author).then(async res => {
                switch (res.loadType) {
                    case "TRACK_LOADED":
                        player.queue.add(res.tracks[0]);
    
                        const Qembed = new discord.MessageEmbed()
                            .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
                            .setDescription(`Enqueuing \`${res.tracks[0].title}\` \`${Utils.formatTime(res.tracks[0].duration, true)}\``)
                        message.channel.send();
                        if (!player.playing) player.play()
                        break;
    
                    case "SEARCH_RESULT":
                        let index = 1;
                        const tracks = res.tracks.slice(0, 5);
                        const embed = new discord.MessageEmbed()
                            .setAuthor("Song Selection.", message.author.displayAvatarURL())
                            .setDescription(tracks.map(video => `**${index++} -** ${video.title}`))
                            .setColor("GREEN")
                            .setFooter("Your response time closes within the next 30 seconds. Type 'cancel' to cancel the selection");
    
                        await message.channel.send(embed);
    
                        const collector = message.channel.createMessageCollector(m => {
                            return m.author.id === message.author.id && new RegExp(`^([1-5]|cancel)$`, "i").test(m.content)
                        }, {
                            time: 30000,
                            max: 1
                        });
    
                        collector.on("collect", m => {
                            if (/cancel/i.test(m.content)) return collector.stop("cancelled")
    
                            const track = tracks[Number(m.content) - 1];
                            player.queue.add(track)
    
                            const Q2Embed = new discord.MessageEmbed()
                                .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL())
                                .setDescription(`Enqueuing \`${track.title}\` \`${Utils.formatTime(track.duration, true)}\``)
                                .setColor("RED");
    
                            message.channel.send(Q2Embed);
                            if (!player.playing) player.play();
                        });
    
                        collector.on("end", (_, reason) => {
                            if (["time", "cancelled"].includes(reason)) return message.channel.send("Cancelled selection.")
                        });
                        break;
    
                    case "PLAYLIST_LOADED":
                        res.playlist.tracks.forEach(track => player.queue.add(track));
                        const duration = Utils.formatTime(res.playlist.tracks.reduce((acc, cur) => ({
                            duration: acc.duration + cur.duration
                        })).duration, true);
                        message.channel.send(`Enqueuing \`${res.playlist.tracks.length}\` \`${duration}\` tracks in playlist \`${res.playlist.info.name}\``);
                        if (!player.playing) player.play()
                        break;
                }
            }).catch(err => message.channel.send(err.message))
        } else {
            message.reply("You need to be in a voice channel to play music!")
        }
    }
}