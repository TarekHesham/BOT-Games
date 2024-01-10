const Discord = require('discord.js');
const { db } = require("../../database/connect");
const { colorEmbed, owners } = require("../../config.json");

module.exports = {
    name: 'setavater',
    description: 'تقوم بتغيير صورة البوت',
    aliases: ['sa'],
    vip: true,
    run: async (message, args, client) => {
        
        db.query(`SELECT * FROM vip WHERE id = "${message.guild.id}"`, async (err, req) => {
            if (err) throw err;
            if (!req[0]) return;

            if (owners.includes(message.author.id)) {

                const Embed = new Discord.MessageEmbed()
                    .setColor(colorEmbed)
                    .setDescription(`**تم تغيير صورة البوت بنجاح | ☑**`);

                if (!args.join(' ').startsWith('http') || !args) return Embed.setDescription(`**برجاء ادخال رابط صورة صالح | :x:**`), message.channel.send(Embed);
                await client.user.setAvatar(args[0]);
                return message.channel.send(Embed);

            } else if (message.guild.owner == message.author.id) {

                const Embed = new Discord.MessageEmbed()
                    .setColor(colorEmbed)
                    .setDescription(`**تم تغيير صورة البوت بنجاح | ☑**`);

                if (!args.join(' ').startsWith('http') || !args) return Embed.setDescription(`**برجاء ادخال رابط صورة صالح | :x:**`), message.channel.send(Embed);
                await client.user.setAvatar(args[0]);
                return message.channel.send(Embed);

            } else if (req[0].owner == message.author.id) {

                const Embed = new Discord.MessageEmbed()
                    .setColor(colorEmbed)
                    .setDescription(`**تم تغيير صورة البوت بنجاح | ☑**`);

                if (!args.join(' ').startsWith('http') || !args) return Embed.setDescription(`**برجاء ادخال رابط صورة صالح | :x:**`), message.channel.send(Embed);
                await client.user.setAvatar(args[0]);
                return message.channel.send(Embed);

            };

        });

    },
};