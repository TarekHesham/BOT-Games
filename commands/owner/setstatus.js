const Discord = require('discord.js');
const { db } = require("../../database/connect");
const { colorEmbed, owners } = require("../../config.json");

module.exports = {
    name: 'setstatus',
    description: 'تقوم بتغيير حالة البوت',
    aliases: ['ss'],
    vip: true,
    run: async (message, args, client) => {
        if (!args || args == null || args == '') return;
        if (owners.includes(message.author.id)) {
            const Embed = new Discord.MessageEmbed()
                .setColor(colorEmbed)
                .setDescription(`**تم تغيير حالة البوت بنجاح | ☑**`);

            await client.user.setStatus(args[0].toLowerCase()).catch(err => {
                Embed.setDescription(`**:x: | برجاء كتابة الحالة مثل هذه \n [ dnd - idle - online - invisible ]**`);
                return message.channel.send(Embed);
            });
            return message.channel.send(Embed);
        }

        db.query(`SELECT * FROM vip WHERE id = "${message.guild.id}"`, async (err, req) => {
            if (err) throw err;
            if (!req[0]) return;

            if (message.guild.owner == message.author.id) {
                const Embed = new Discord.MessageEmbed()
                    .setColor(colorEmbed)
                    .setDescription(`**تم تغيير حالة البوت بنجاح | ☑**`);

                await client.user.setStatus(args[0].toLowerCase()).catch(err => {
                    Embed.setDescription(`**:x: | برجاء كتابة الحالة مثل هذه \n [ dnd - idle - online - invisible ]**`);
                    return message.channel.send(Embed);
                });
                return message.channel.send(Embed);
            } else if (req[0].owner == message.author.id) {
                const Embed = new Discord.MessageEmbed()
                    .setColor(colorEmbed)
                    .setDescription(`**تم تغيير حالة البوت بنجاح | ☑**`);

                await client.user.setStatus(args[0].toLowerCase()).catch(err => {
                    Embed.setDescription(`**:x: | برجاء كتابة الحالة مثل هذه \n [ dnd - idle - online - invisible ]**`);
                    return message.channel.send(Embed);
                });
                return message.channel.send(Embed);
            };
        });
    },
};