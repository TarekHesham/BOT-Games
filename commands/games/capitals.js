const quiz = require('../../data/capitals.json');
const { updatePointsUser, updatePointsServer } = require("../../database/data");
const Canvas = require('canvas');
const Discord = require('discord.js');
const isPlaying = new Set();

module.exports = {
    name: 'capitals',
    description: 'ما هي عاصمة الدولة؟',
    aliases: ['c', 'عواصم'],
    run: async (message, args, client, photo) => {
        if (isPlaying.has(message.channel.id)) return message.channel.send("هناك جولة بالفعل! | :x:");

        try {
            const item = quiz[Math.round(Math.random() * quiz.length)];

            const filter = response => {
                return item.answers.some(
                    answer => answer.toLowerCase() === response.content.toLowerCase()
                );
            };

            const canvas = Canvas.createCanvas(1056, 428);
            const ctx = canvas.getContext('2d');
            let ground = new Canvas.Image();
            ground.src = './imgs/' + photo;
            ctx.drawImage(ground, 0, 0, 1056, 428);

            // Write "Awesome!"
            ctx.font = 'bold 60px Calibri';

            ctx.fillStyle = '#FFFFFF';
            ctx.direction = 'rtl';
            ctx.textAlign = "center";

            ctx.fillText('ما هي عاصمة', 428, 135);
            ctx.fillText(`${item.question}`, 428, 260);

            let file = new Discord.MessageAttachment(canvas.toBuffer(), 'games.png');

            let date = Date.now();

            await message.channel.send(file).then(() => {
                isPlaying.add(message.channel.id);

                message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ["time"] })
                    .then(collected => {
                        isPlaying.delete(message.channel.id);
                        message.channel.send(`> **مبروك! الفائز هو ${collected.first().author} ، قام بتفكيك الجملة قبل انتهاء الوقت بـ \`${(((date + 15000) - Date.now()) / 1000).toFixed(1)}\` ثواني!**`);
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