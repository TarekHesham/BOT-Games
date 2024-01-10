const quiz = require('../../data/famous.json');
const { updatePointsUser, updatePointsServer } = require("../../database/data");
const { colorEmbed } = require("../../config.json");
const { MessageEmbed } = require('discord.js');
const isPlaying = new Set();

module.exports = {
    name: 'famous',
    description: 'من هو هذا المشهور؟',
    aliases: ['خمن', 'مشاهير'],
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
                .setAuthor(client.user.username, client.user.avatarURL({ size: 1024 }))
                .setDescription("**خمن من في الصورة ?**")
                .setImage(item.question);

            await message.channel.send(embed).then(() => {
                isPlaying.add(message.channel.id);

                message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ["time"] })
                    .then(collected => {
                        isPlaying.delete(message.channel.id);
                        message.channel.send(` \n> **${collected.first().author} مبروك! الفائز هو**`);
                        updatePointsUser(message.author.id), updatePointsServer(message.guild.id, message.author.id);
                    })
                    .catch(errors => {
                        isPlaying.delete(message.channel.id);
                        message.channel.send(` \n> **انتهى الوقت ، لم يفز أحد...**\n الاجابة الصحيحة هي \`${item.answers[0]}\``);
                    });
            });
        } catch (err) {
            return;
        };
    },
};