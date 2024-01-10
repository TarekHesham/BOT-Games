const quiz = require('../../data/emojis.json');
const { updatePointsUser, updatePointsServer } = require("../../database/data");
const { colorEmbed } = require("../../config.json");
const { MessageEmbed } = require('discord.js');
const isPlaying = new Set();

module.exports = {
    name: 'emojis',
    description: 'تذكر الاموجي الصحيح',
    aliases: ['e', 'ايموجي', 'ايم'],
    run: async (message, args, client) => {
        if (isPlaying.has(message.channel.id)) return message.channel.send("هناك جولة بالفعل! | :x:");

        try {
            const item = quiz[Math.round(Math.random() * quiz.length)];

            const filter = response => {
                return item.answers.some(
                    answer => answer.toLowerCase() === response.content.toLowerCase()
                );
            };

            const embed = new MessageEmbed()
                .setColor(colorEmbed)
                .setTitle("تذكر الايموجي التالي")
                .setThumbnail(item.question)
                .setFooter(client.user.username, client.user.avatarURL());
            message.channel.send(embed).then(msg => {
                isPlaying.add(message.channel.id);

                setTimeout(() => {
                    embed.setTitle('لديك 20 ثواني للإرسال الايموجي الصحيح').setThumbnail("https://i.imgur.com/R0TQo1w.png");
                    msg.edit(embed);
                    msg.channel.awaitMessages(filter, { max: 1, time: 20000, errors: ["time"] })
                        .then(collected => {
                            isPlaying.delete(message.channel.id);
                            message.channel.send(` \n> **${collected.first().author} مبروك! الفائز هو**`);
                            updatePointsUser(message.author.id), updatePointsServer(message.guild.id, message.author.id);

                        })
                        .catch(errors => {
                            isPlaying.delete(message.channel.id);
                            message.channel.send(" \n> **انتهى الوقت ، لم يفز أحد...**");
                        });
                }, 3000);
            });
        } catch (err) {
            return;
        };
    },
};