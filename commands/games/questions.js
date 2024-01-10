const quiz = require('../../data/questions.json');
const { MessageEmbed } = require('discord.js');
const isPlaying = new Set();
const { updatePointsUser, updatePointsServer } = require("../../database/data");
const { colorEmbed } = require("../../config.json");

module.exports = {
    name: 'questions',
    description: 'اسألة عامة',
    aliases: ['q', 'سؤال', 'سوال'],
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
                .setDescription(item.question);

            await message.channel.send('**اختر الاجابة الصحيحة:**', { embed: embed }).then(() => {
                isPlaying.add(message.channel.id);

                message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ["time"] })
                    .then(collected => {
                        isPlaying.delete(message.channel.id);
                        message.channel.send(`\n> **مبروك! الفائز هو ${collected.first().author}، الإجابة الصحيحة هي : \`${item.answers[0]}\`**`);
                        updatePointsUser(message.author.id), updatePointsServer(message.guild.id, message.author.id);

                    })
                    .catch(errors => {
                        isPlaying.delete(message.channel.id);
                        message.channel.send(`\n> **انتهى الوقت ، لم يفز أحد... ، الإجابة الصحيحة هي : \`${item.answers[0]}\`**`);
                    });
            });
        } catch (err) {
            return;
        };
    },
};