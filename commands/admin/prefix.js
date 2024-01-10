const Discord = require('discord.js');
const { updatePrefix } = require("../../database/data");
const { db } = require("../../database/connect");
const { colorEmbed } = require("../../config.json");

module.exports = {
    name: 'prefix',
    description: 'يحدد بادئة خاصة بالخادم',
    aliases: ['setprefix'],
    run: async (message) => {

        const args = message.content.split(' ').slice(1);
        if (!args[0] || args[0] == 'undefined') {
            db.query(`SELECT prefix FROM servers WHERE guild = "${message.guild.id}"`, async (err, req) => {
                if (err) throw err;
                if (!req[0]) return;
                message.channel.send(new Discord.MessageEmbed()
                    .setColor(colorEmbed)
                    .setDescription(`**البرفكس الحالي: \`${req[0].prefix}\`**`)
                    .setFooter('يرجى كتابة برفكس جديد'));
            });
            return;
        };

        if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(new Discord.MessageEmbed()
            .setColor(colorEmbed)
            .setDescription(`**:x: | ليس لديك إذن بهذا الأمر!**`)
        );

        if (args[1]) return message.channel.send(new Discord.MessageEmbed()
            .setColor(colorEmbed)
            .setDescription(`**:x: | لا يمكن أن تحتوي البادئة على مسافتين**`));

        updatePrefix(message.guild.id, args[0]);

        message.channel.send(new Discord.MessageEmbed()
            .setColor(colorEmbed)
            .setDescription(`**☑️ | تم بنجاح تعيين البادئة الجديدة إلى \`${args[0]}\`**`))
    },
};