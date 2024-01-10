const Canvas = require('canvas');
const Discord = require('discord.js');
const { updatePointsUser, updatePointsServer } = require("../../database/data");

const isPlaying = new Set();
module.exports = {
    name: 'math',
    description: 'ما هو حل المسألة؟',
    aliases: ['m', 'رياضيات', 'عمليات', 'ريض', 'حساب'],
    run: async (message, args, client, photo) => {
        if (isPlaying.has(message.channel.id)) return message.channel.send("هناك جولة بالفعل! | :x:");
        try {
            const num1 = Math.round(Math.random() * 99);
            const num2 = Math.round(Math.random() * 99);
            const random = Math.round(Math.random() * 4);

            const data = {
                'x': ['-', '+', 'x', '÷'],
                'y': ['طرح', 'جمع', 'ضرب', 'قسمة']
            };

            let ecual;
            const ecu = data.x[random];
            const ecuAr = data.y[random];
            if (ecu === '+') ecual = (num1 + num2);
            if (ecu === '-') ecual = (num1 - num2);
            if (ecu === 'x') ecual = (num1 * num2);
            if (ecu === '÷') ecual = (num1 / num2);

            let item = {
                "question": [num1, ecu, num2].join(' '),
                "answer": ecual
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

            ctx.fillText(`ما هوا حاصل ${ecuAr}`, 428, 135);
            ctx.fillText(`${item.question}`, 428, 260, 700);

            let file = new Discord.MessageAttachment(canvas.toBuffer(), 'games.png');

            let date = Date.now();
            await message.channel.send(file).then(() => {
                isPlaying.add(message.channel.id);

                message.channel.awaitMessages(res => item.answer == res.content, { max: 1, time: 15000, errors: ["time"] })
                    .then(collected => {
                        isPlaying.delete(message.channel.id);
                        message.channel.send(`> **مبروك! الفائز هو ${collected.first().author} ، قام ب${ecuAr} العددين قبل انتهاء الوقت بـ \`${(((date + 15000) - Date.now()) / 1000).toFixed(1)}\` ثواني!**`);
                        updatePointsUser(message.author.id), updatePointsServer(message.guild.id, message.author.id);

                    })
                    .catch(errors => {
                        isPlaying.delete(message.channel.id);
                        message.channel.send("\n> **انتهى الوقت ، لم يفز أحد...**");
                    });
            });
        } catch (err) {
            return;
        };
    },
};