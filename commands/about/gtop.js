const Discord = require('discord.js');
const { db } = require("../../database/connect");
const { colorEmbed } = require("../../config.json");
const hashe = require("../../database/base64");

module.exports = {
    name: 'gtop',
    description: 'لعرض أفضل 10 أشخاص على جميع السيرفرات',
    aliases: ['الافضل'],
    run: async (message, args, client) => {
        db.query(`SELECT * FROM users ORDER BY users.points DESC LIMIT 10`, async (err, res) => {
            let i = 1;
            const usersData = [];

            const data = await res.sort((a, b) => b.points - a.points);

            for (let users of data.filter(item => item)) if (await users != undefined) usersData.push(`**#${i++} I [@${hashe.decode(users.username)}] [\`${users.points}\`]**`);

            const embed = new Discord.MessageEmbed()
                .setColor(colorEmbed)
                .setAuthor(`افضل عشر لاعبين على مستوى السيرفرات`, client.user.avatarURL())
                .setDescription(usersData.join('\n'))
                .setFooter(client.user.username, client.user.avatarURL());
            return message.channel.send(embed);
        });
    },
};