const Discord = require('discord.js');
const { db } = require("../../database/connect");
const pretty = require("pretty-ms");
const { colorEmbed, owners } = require("../../config.json");

module.exports = {
    name: 'vip',
    description: 'عرض مدة اشتراك الفي اي بي',
    aliases: ['pre'],
    vip: true,
    run: async (message) => {
        db.query(`SELECT * FROM vip WHERE id = "${message.guild.id}"`, async (err, req) => {
            if (err) throw err;
            if (!req[0]) return;
            const cooldown = 2592000000;

            if (owners.includes(message.author.id)) {
                const date = cooldown * req[0].months - (Date.now() - req[0].time);
                const Embed = new Discord.MessageEmbed()
                    .setColor(colorEmbed)
                    .setDescription(`**${pretty(date, {verbose: true})} الوقت المتبقي علي انتهاء مدة الاشتراك هوا**`);

                return message.channel.send(Embed);
            };

            if (req[0].owner == message.author.id) {
                const date = cooldown * req[0].months - (Date.now() - req[0].time);
                const Embed = new Discord.MessageEmbed()
                    .setColor(colorEmbed)
                    .setDescription(`**${pretty(date, {verbose: true})} الوقت المتبقي علي انتهاء مدة الاشتراك هوا**`);

                return message.channel.send(Embed);
            };

        });
    },
};