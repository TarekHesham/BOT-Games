const Discord = require('discord.js');
const { db } = require("../../database/connect");
const { colorEmbed, botID } = require("../../config.json");

module.exports = {
    name: 'help',
    description: 'قائمة المساعدة',
    aliases: ['h'],
    run: async (message, args, client) => {
        const games = client.games.array();

        const admin = client.admin.array();

        const about = client.about.array();

        const owner = client.owner.array();

        const pre = [];
        const Free = [];

        games.forEach(data => {
            if (data.vip) pre.push(`**\`${data.description}\` | 🎮\n⭐ ${data.name},${data.aliases ? data.aliases : ' '}**`);
            if (!data.vip) Free.push(`**\`${data.description}\` | 🎮\n⭐ ${data.name},${data.aliases ? data.aliases : ' '}**`);
        });

        const dataAdmin = admin.map(data => `**\`${data.description}\` | 🎖️\n👉 ${data.name},${data.aliases ? data.aliases : ' '}**`).join('\n');

        const dataAbout = about.map(data => `> :video_game: | [__${data.description}__]\n> 💡 - [${data.name}, ${data.aliases ? data.aliases : ' '}]`).join('\n');

        const dataOwner = owner.map(data => `> :video_game: | [__${data.description}__]\n> 💡 - [${data.name}, ${data.aliases ? data.aliases : ' '}]`).join('\n');


        await message.author.send(`**
> :satellite: |  البرفكس الخاص بالبوت هو [__-__]
> :satellite: | الأوامر الخاصه بالبوت :
            ・・・・・・・・・・・・・・・・・・

${dataAbout}

            ・・・・・・・・・・・・・・・・・・
> :satellite: | رابط دعوة البوت المجاني : [ https://bit.ly/3uVAleW ]
> :satellite: | سيرفر الدعم الفني : [ Here ]

**`).then(msg => {
            message.react("☑️");
        }).catch(err => {
            return message.react("❌");
        });

        const Embed = new Discord.MessageEmbed().setColor(colorEmbed);

        Embed.setTitle('الالعاب الخاصه بالبوت')
            .setDescription(Free.join('\n'));
        await message.author.send(Embed);

        Embed.setTitle('العاب النسخة المدفوعة')
            .setDescription(pre.join('\n'));
        await message.author.send(Embed);

        if (message.member.hasPermission("ADMINISTRATOR")) {
            Embed.setTitle('الاعدادات الخاصة بالبوت').setDescription(dataAdmin);
            await message.author.send(Embed);
        };

        db.query(`SELECT * FROM vip WHERE id = "${message.guild.id}"`, async (err, req) => {
            if (err) throw err;
            if (!req[0]) return;
            if (req[0].owner == message.author.id) {
                Embed.setTitle("إعدادات الاونر")
                    .setDescription(dataOwner);
                await message.author.send(Embed);
            };
        });

    },
};