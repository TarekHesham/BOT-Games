const Discord = require('discord.js');
const { updateStyle } = require("../../database/data");
const { db } = require("../../database/connect");
const { colorEmbed } = require("../../config.json");

module.exports = {
    name: 'style',
    description: 'تغيير خلفية الالعاب',
    aliases: ['setstyle'],
    run: async (message) => {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(new Discord.MessageEmbed()
            .setColor(colorEmbed)
            .setDescription(`**:x: | ليس لديك إذن بهذا الأمر!**`)
        );
        db.query(`SELECT style FROM servers WHERE guild = "${message.guild.id}"`, async (err, req) => {
            if (err) throw err;
            if (!req[0]) return;
            const Embed = new Discord.MessageEmbed()
                .setColor(colorEmbed)
                .setDescription(`**برجاء كتابة رقم من 1 - 3 الاستايل الذي تريده\nالاستايل الحالي:**`)
                .attachFiles(['./imgs/' + req[0].style])
                .setImage('attachment://' + req[0].style);

            message.channel.send(Embed).then(msg => {
                let filter = m => m.author.id == message.author.id;
                let collector = msg.channel.awaitMessages(filter, { time: 60000, max: 1 });
                collector.then(async res => {
                    res = res.first();
                    let st;
                    if (res.content == '1') st = '1.png';
                    if (res.content == '2') st = '2.png';
                    if (res.content == '3') st = '3.png';

                    await updateStyle(message.guild.id, st);

                    msg.delete();

                    const em = new Discord.MessageEmbed()
                        .setDescription("> **تم تغيير الشكل**")
                        .attachFiles(['./imgs/' + st])
                        .setImage('attachment://' + st);
                    message.reply(em);
                });
                collector.catch(err => {
                    return console.log("Time out");
                });
            });
        });
    },
};