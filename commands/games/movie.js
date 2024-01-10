
const quiz = require('../../data/movie.json');
const { MessageEmbed } = require('discord.js');
const isPlaying = new Set();
const { updatePointsUser, updatePointsServer } = require("../../database/data");
const { colorEmbed } = require("../../config.json");

module.exports = {
    name: 'movie',
    description: 'قوي لغتك الانجليزية بلقطة على السريع',
    aliases: ['فلم', 'فيلم'],
    vip: true,
    run: async (message) => {
        if (isPlaying.has(message.author.id)) return message.channel.send("هناك جولة بالفعل! | :x:");

        try {
            const item = quiz[Math.round(Math.random() * quiz.length)];
            
            isPlaying.add(message.author.id);

            const filter = user => user.author.id == message.author.id;

            const embed = new MessageEmbed()
                .setColor(colorEmbed)
                .setAuthor(message.author.username, message.author.avatarURL({ size: 1024 }))
                .setTitle("ما هي الترجمة الصحيحة؟");

            const msgMovie = {
                files: [{
                    attachment: `${__dirname}/../../data/movies/${item && item.name}`,
                    name: item && item.name
                }],
                embed: embed
            };
            
            await message.channel.send(msgMovie).then(msg => {
                setTimeout(() => {
                    embed.setDescription(`**${item.question}**`);
                    msg.edit(msgMovie);
                    msg.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ["time"] })
                        .then(collected => {
                            isPlaying.delete(message.author.id);
                            if (collected.first().content.toLowerCase() !== item.answers[0]) return message.reply(`**اجابتك خاطئة :hot_face:, الجواب الصحيح هو ${item.answers[1]}**`);
                            message.reply(`**أحسنت اجابتك صحيحة :partying_face:**`);
                            updatePointsUser(message.author.id), updatePointsServer(message.guild.id, message.author.id);

                        })
                        .catch(errors => {
                            isPlaying.delete(message.author.id);
                            message.reply(`**انتهى الوقت, الجواب الصحيح هو : ${item.answers[1]}.**`);
                        });
                }, 6000);

            });
        } catch (err) {
            return isPlaying.delete(message.author.id);
        };
    },
};
