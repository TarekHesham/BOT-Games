const Discord = require('discord.js');
const { db } = require("../../database/connect");
const { colorEmbed, owners } = require("../../config.json");

module.exports = {
    name: 'setname',
    description: 'تقوم بتغيير اسم البوت',
    aliases: ['sn'],
    vip: true,
    run: async (message, args, client) => {
        if (!args || args == null || args == '') return;
        if (owners.includes(message.author.id)) {
            const Embed = new Discord.MessageEmbed()
                .setColor(colorEmbed)
                .setDescription(`**تم تغيير اسم البوت بنجاح | ☑**`);
            await client.user.setUsername(args.join(' '));
            return message.channel.send(Embed);
        }
        
        db.query(`SELECT * FROM vip WHERE id = "${message.guild.id}"`, async (err, req) => {
            if (err) throw err;
            if (!req[0]) return;

            if (message.guild.owner == message.author.id) {
                const Embed = new Discord.MessageEmbed()
                    .setColor(colorEmbed)
                    .setDescription(`**تم تغيير اسم البوت بنجاح | ☑**`);
                await client.user.setUsername(args.join(' '));
                return message.channel.send(Embed);
            } else if (req[0].owner == message.author.id) {
                const Embed = new Discord.MessageEmbed()
                    .setColor(colorEmbed)
                    .setDescription(`**تم تغيير اسم البوت بنجاح | ☑**`);
                await client.user.setUsername(args.join(' '));
                return message.channel.send(Embed);
            };
        });
    },
};