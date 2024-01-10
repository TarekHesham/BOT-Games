const Canvas = require('canvas');
const Discord = require('discord.js');
const isPlaying = new Set();
const { updatePointsUser, updatePointsServer } = require("../../database/data");

module.exports = {
    name: 'numbers',
    description: 'اكتب الرقم قبل انتهاء الوقت',
    aliases: ['num', 'nums', 'n', 'ارقام'],
    run: async (message, args, client, photo) => {
        if (isPlaying.has(message.channel.id)) return message.channel.send("هناك جولة بالفعل! | :x:");

        try {
            const num = Math.floor(Math.random() * 99999);
            const item = {
                "question": num.toString().split('').join(' '),
                "answer": num.toString()
            };

            const canvas = Canvas.createCanvas(1056, 428);
            const ctx = canvas.getContext('2d');
            let ground = new Canvas.Image();
            ground.src = './imgs/' + photo;
            ctx.drawImage(ground, 0, 0, 1056, 428);

            ctx.font = 'bold 60px Calibri';
            ctx.fillStyle = '#FFFFFF';
            ctx.direction = 'rtl';
            ctx.textAlign = "center";
            ctx.fillText('حاول كتابة الرقم التالي', 428, 135);
            ctx.fillText(`${item.question}`, 428, 260, 700);

            const file = new Discord.MessageAttachment(canvas.toBuffer(), 'games.png');

            await message.channel.send(file).then(() => {
                isPlaying.add(message.channel.id);

                let date = Date.now();
                message.channel.awaitMessages(res => item.answer == res.content, { max: 1, time: 15000, errors: ["time"] })
                    .then(collected => {
                        isPlaying.delete(message.channel.id);
                        message.channel.send(`> **مبروك! الفائز هو ${collected.first().author} ، قام بكتابة الرقم قبل انتهاء الوقت بـ \`${(((date + 15000) - Date.now()) / 1000).toFixed(1)}\` ثواني!**`);
                        updatePointsUser(message.author.id), updatePointsServer(message.guild.id, message.author.id);

                    })
                    .catch(errors => {
                        isPlaying.delete(message.channel.id);
                        message.channel.send("\n> **انتهى الوقت ، لم يفز أحد...**");
                    });
            });
        } catch (err) {
            return
        };
    },
};