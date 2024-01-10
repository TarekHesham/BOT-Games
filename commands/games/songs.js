
const quiz = require('../../data/songs.json');
const Discord = require('discord.js');
const isPlaying = new Set();
const ytdl = require('ytdl-core-discord'); //  @discordjs/opus + ytdl-core-discord
const { updatePointsUser, updatePointsServer } = require("../../database/data");
const { colorEmbed } = require("../../config.json");

module.exports = {
    name: 'songs',
    description: 'اسمع و خمن اسم المغني او الاغنية',
    aliases: ['سمعني'],
    vip: true,
    run: async (message, args, client) => {
        if (message.author.bot) return;

        const item = quiz[Math.round(Math.random() * quiz.length)];

        if (!item) return;

        const channelVoice = message.member.voice.channel;

        if (!channelVoice) return message.reply("**الرجاء دخول روم صوتي قبل بداء اللعب!**");

        if (isPlaying.has(message.channel.id)) return message.channel.send("هناك جولة بالفعل! | :x:");


        const filter = user => user.member.voice.channel == channelVoice;

        const embedSongs = new Discord.MessageEmbed().setColor(colorEmbed)
            .setFooter(client.user.username, client.user.avatarURL({ size: 1024 }));

        if (item && !item.category) {
            item = quiz[Math.round(Math.random() * quiz.length)];
        } else if (item && !item.category) {
            item = quiz[Math.round(Math.random() * quiz.length)]
        };

        if (item && item.category == "اغنية") {
            embedSongs.setTitle("ما اسم هذه الاغنية ؟");
            embedSongs.setThumbnail("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/237/musical-score_1f3bc.png");
        } else {
            embedSongs.setTitle("من هو مغني هذه الاغنية ؟");
            embedSongs.setThumbnail("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/237/microphone_1f3a4.png");
        };

        message.channel.send(embedSongs).then(async msg => {
            isPlaying.add(message.channel.id);

            if (channelVoice) await channelVoice.join().then(async connect => {
                await connect.play(await ytdl(item && item.question), { type: 'opus' });
            });
            msg.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ["time"] })
                .then(async collected => {
                    if (!collected.first().bot) {
                        isPlaying.delete(message.channel.id);
                        if (collected.first().content.toLowerCase() !== item.answers[0]) return message.channel.send(`**${collected.first().author}, اجابتك خاطئة :hot_face:, الجواب الصحيح هو ${item.answers[0]}**`), channelVoice.leave();
                        message.channel.send(`**${collected.first().author} أحسنت اجابتك صحيحة :partying_face:**`);
                        if (isPlaying.has(message.channel.id)) isPlaying.delete(message.channel.id);
                        await updatePointsUser(message.author.id), await updatePointsServer(message.guild.id, message.author.id);
                        channelVoice.leave();
                    };
                })
                .catch(errors => {
                    isPlaying.delete(message.channel.id);
                    message.reply("\n> **انتهى الوقت ، لم يفز أحد..**");
                    channelVoice.leave();
                });
        });


    },
};
