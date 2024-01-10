const Discord = require('discord.js');
const { bs } = require("../../database/connect");
const { colorEmbed } = require("../../config.json");

module.exports = {
    name: 'top',
    description: 'لعرض أفضل 10 أشخاص على السيرفر فقط',
    aliases: ['توب'],
    run: async (message, args, client) => {
        bs.query(`SELECT * FROM \`${message.guild.id}\` LIMIT 10`, async (err, res) => {
            let i = 1;
            const ma = res.sort((a, b) => b.points - a.points).map(data => `**#${i++} | <@${data.member}> [\`${data.points}\`]**`).join('\n');
            const embed = new Discord.MessageEmbed()
                .setColor(colorEmbed)
                .setAuthor(`افضل عشر لاعبين في سيرفر ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
                .setDescription(ma)
                .setFooter(client.user.username, client.user.avatarURL());
            return message.channel.send(embed);
        });
    },
};