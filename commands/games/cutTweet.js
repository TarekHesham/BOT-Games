const quiz = require('../../data/cuttweet.json');
const { MessageEmbed } = require('discord.js');
const { colorEmbed } = require("../../config.json");

module.exports = {
    name: 'cuttweet',
    description: 'كت تويت على السريع',
    aliases: ['tweet', 'cut', 'تويت', 'كت'],
    run: async (message, args, client) => {
        try {
            const item = quiz[Math.round(Math.random() * quiz.length)];
            const embed = new MessageEmbed()
                .setColor(colorEmbed)
                .setAuthor(message.author.username, message.author.avatarURL({ size: 1024, dynamic: true }))
                .setDescription(`**${item.question}**`)
                .setThumbnail(message.guild.iconURL({ dynamic: true, size: 1024 }))
                .setFooter(client.user.username, client.user.avatarURL());

            await message.channel.send(embed);
        } catch (err) {
            return;
        };
    },
};