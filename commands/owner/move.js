const Discord = require('discord.js');
const { db } = require("../../database/connect");
const { colorEmbed, owners, prefix } = require("../../config.json");

module.exports = {
    name: 'move',
    description: 'تقوم بتغيير السيرفر الخاص بالبوت',
    aliases: ['movebot'],
    vip: true,
    run: async (message, args, client) => {
        if (!args || args == null || args == '') return;

        db.query(`SELECT * FROM vip WHERE id = "${message.guild.id}"`, async (err, req) => {
            if (err) throw err;
            if (!req[0]) return;
            if (owners.includes(message.author.id)) {

                db.query(`DELETE FROM \`vip\` WHERE \`vip\`.\`id\` = "${message.guild.id}"`, (err) => {
                    if (err) throw err;
                });

                db.query(`INSERT IGNORE INTO vip (id, owner, time, server, months) VALUES ("${args}", "${message.author.id}", "${req[0].time}", "${args}", "${req[0].months}")`, (err) => {
                    if (err) throw err;
                });

                db.query(`INSERT IGNORE INTO servers (guild, prefix, style) VALUES ("${args}", "${prefix}", "3.png")`, async (err, req) => {
                    if (err) throw err;
                });

                db.query(`UPDATE servers SET bot = "${client.user.id}", months = "${req[0].months}", time = "${req[0].time}", vip = true WHERE guild = "${args}" `, (err) => {
                    if (err) throw err;
                });

                db.query(`UPDATE servers SET bot = null, months = null, time = null, vip = false WHERE guild = "${message.guild.id}" `, (err) => {
                    if (err) throw err;
                });

                const Embed = new Discord.MessageEmbed()
                    .setColor(colorEmbed)
                    .setDescription(`**تم نقل السيرفر بنجاح | ☑**`);
                await message.channel.send(Embed);

                await message.guild.leave();

            } else if (message.guild.owner == message.author.id) {

                db.query(`DELETE FROM \`vip\` WHERE \`vip\`.\`id\` = "${message.guild.id}"`, (err) => {
                    if (err) throw err;
                });

                db.query(`INSERT IGNORE INTO vip (id, owner, time, server, months) VALUES ("${args}", "${message.author.id}", "${req[0].time}", "${args}", "${req[0].months}")`, (err) => {
                    if (err) throw err;
                });

                db.query(`INSERT IGNORE INTO servers (guild, prefix, style) VALUES ("${args}", "${prefix}", "3.png")`, async (err, req) => {
                    if (err) throw err;
                });

                db.query(`UPDATE servers SET bot = "${client.user.id}", months = "${req[0].months}", time = "${req[0].time}", vip = true WHERE guild = "${args}" `, (err) => {
                    if (err) throw err;
                });

                db.query(`UPDATE servers SET bot = null, months = null, time = null, vip = false WHERE guild = "${message.guild.id}" `, (err) => {
                    if (err) throw err;
                });

                const Embed = new Discord.MessageEmbed()
                    .setColor(colorEmbed)
                    .setDescription(`**تم نقل السيرفر بنجاح | ☑**`);
                await message.channel.send(Embed);

                await message.guild.leave();

            } else if (req[0].owner == message.author.id) {

                db.query(`DELETE FROM \`vip\` WHERE \`vip\`.\`id\` = "${message.guild.id}"`, (err) => {
                    if (err) throw err;
                });

                db.query(`INSERT IGNORE INTO vip (id, owner, time, server, months) VALUES ("${args}", "${message.author.id}", "${req[0].time}", "${args}", "${req[0].months}")`, (err) => {
                    if (err) throw err;
                });

                db.query(`INSERT IGNORE INTO servers (guild, prefix, style) VALUES ("${args}", "${prefix}", "3.png")`, async (err, req) => {
                    if (err) throw err;
                });

                db.query(`UPDATE servers SET bot = "${client.user.id}", months = "${req[0].months}", time = "${req[0].time}", vip = true WHERE guild = "${args}" `, (err) => {
                    if (err) throw err;
                });

                db.query(`UPDATE servers SET bot = null, months = null, time = null, vip = false WHERE guild = "${message.guild.id}" `, (err) => {
                    if (err) throw err;
                });

                const Embed = new Discord.MessageEmbed()
                    .setColor(colorEmbed)
                    .setDescription(`**تم نقل السيرفر بنجاح | ☑**`);
                await message.channel.send(Embed);

                await message.guild.leave();

            };
        });

    },
};