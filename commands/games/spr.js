const Discord = require('discord.js');
const data = new Map();
const items = ["🗻", "📃", "✂️"];
const { colorEmbed } = require("../../config.json");

module.exports = {
    name: 'rps',
    description: 'حجرة ورقة مقص 🤜🤛',
    aliases: ["spr"],
    run: async (message) => {
        const member = message.mentions.users.first();

        if (member && data.has(member.id)) return message.channel.send(`**> :x: | يجب انهاء الجولة الحالية مع <@${data.get(member.id).vs}> لبداء جولة جديدة**`);
        if (data.has(message.author.id)) return message.channel.send(`**> :x: | يجب انهاء الجولة الحالية مع <@${data.get(message.author.id).vs}> لبداء جولة جديدة**`);

        const embed = new Discord.MessageEmbed()
            .setColor(colorEmbed)
            .setTitle('> مبارة - حجرة / ورقة / مقص')
            .setDescription(`**> :mount_fuji: - حجرة\n> :page_with_curl: - ورقة\n> :scissors: - مقص\n\n> ضع اختيارك من خلال الايموجي**`);

        if (member && member.bot) return message.reply("**:x: | كيف تبي تلعب مع بوت ي ذكي :]**");
        if (member && member.id == message.author.id) return message.reply("**:x: | لا جد جد كيف تبي تلعب مع نفسك؟, نفسيه انت؟. :]**");

        if (member && member.id !== message.author.id) {

            embed.setDescription(`> **${message.author.username} :vs: ${member.username}**\n\n> ***هل تريد ان تشارك في المباراة***`);

            message.channel.send(embed).then(async msg => {
                const accss = ["✅", "❌"];
                for (let emoji of accss) await msg.react(emoji);

                const filter = async (reaction, user) => {
                    if (!accss.includes(reaction.emoji.name) || user.id != member.id) return reaction.users.remove(user);
                    if (reaction.emoji.name == "✅") {
                        msg.delete();

                        data.set(message.author.id, { choose: false, vs: member.id });
                        data.set(member.id, { choose: false, vs: message.author.id });

                        embed.setDescription(`**:sunglasses: | استعدوا للمباراة في الخاص [${message.author} - ${member}]**`)
                            .setFooter(`${message.author.username} 🆚 ${member.username}`);

                        const msgg = message.channel.send(embed);

                        embed.setDescription(`**> :mount_fuji: - حجرة\n> :page_with_curl: - ورقة\n> :scissors: - مقص\n\n> ضع اختيارك من خلال الايموجي**`)

                        message.author.send(embed).then(async msg => {
                            for (let emoji of items) await msg.react(emoji);

                            const filter = async (reaction, user) => {
                                if (!items.includes(reaction.emoji.name)) return;
                                data.get(message.author.id).choose = await reaction.emoji.name;

                                await msg.edit(`> **تم تسجيل اختيارك**`);

                                msg.delete({ timeout: 3000 });
                            };

                            msg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
                                .catch(err => {
                                    clearInterval(winnner);
                                    data.delete(message.author.id);
                                    data.delete(member.id);
                                    return message.channel.send(`**> :slight_smile:  ماذا تفعل هل تعرف كيف تلعب هذة اللعبة ${message.author}**`), msg.delete();
                                });
                        }).catch(err => {
                            data.delete(message.author.id);
                            data.delete(member.id);
                            message.channel.send(`**:x: | ${message.author} خاصك مقفول**`);
                            return;
                        });

                        member.send(embed).then(async msg => {
                            for (let emoji of items) await msg.react(emoji);

                            const filter = async (reaction, user) => {
                                if (!items.includes(reaction.emoji.name)) return;
                                data.get(member.id).choose = await reaction.emoji.name;

                                await msg.edit(`> **تم تسجيل اختيارك**`);

                                msg.delete({ timeout: 3000 });
                            };

                            msg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
                                .catch(err => {
                                    clearInterval(winnner);
                                    data.delete(message.author.id);
                                    data.delete(member.id);
                                    return message.channel.send(`**> :slight_smile: ماذا تفعل هل تعرف كيف تلعب هذة اللعبة ${member}**`), msg.delete();
                                });
                        }).catch(err => {
                            data.delete(message.author.id);
                            data.delete(member.id);
                            message.channel.send(`**:x: | ${member} خاصك مقفول**`)
                            return;
                        });

                        const winnner = setInterval(async () => {
                            if (data.get(message.author.id).choose && data.get(member.id).choose) {
                                clearInterval(winnner);
                                msgg.then(async m => {
                                    embed.setTitle("> المباراة انتهت")
                                        .setDescription(`**> النتائج\n\n> ${data.get(message.author.id).choose} : اختار - ${message.author.username}\n\n> ${data.get(member.id).choose}  : اختار - ${member.username}**`);
                                    m.edit(`> **${(await checkHuman(message.author, member)).toString()}**`, { embed: embed });
                                    data.delete(message.author.id);
                                    data.delete(member.id);
                                    return;
                                });
                            };
                        }, 1000);

                        return;
                    } else if (reaction.emoji.name == "❌") {
                        msg.delete();
                        return;
                    };

                };

                msg.awaitReactions(filter, { max: 0, time: 30000, errors: ['time'] })
                    .catch(err => {
                        msg.reactions.removeAll();
                        return message.channel.send(`**> :slight_smile:  لا يقم الشخص بالقبول او الرفض في تحديك يبدو انك اسطورة في هذة اللعبة ${message.author}**`), msg.delete();
                    });
            });

        } else {
            embed.setFooter(`${message.author.username} 🆚 Me`);
            message.channel.send(embed).then(async msg => {
                for (let emoji of items) await msg.react(emoji);

                const filter = async (reaction, user) => {
                    if (!items.includes(reaction.emoji.name) || message.author.id != user.id) return reaction.users.remove(user);

                    const Random = items[Math.floor(Math.random() * items.length)];

                    embed.setTitle("> المباراة انتهت")
                        .setDescription(`**> النتائج\n\n> ${reaction.emoji.name} : اختارت - ${message.author.username}\n\n> ${Random} : البوت - اختار**`);

                    msg.edit(`> **${(await check(reaction, Random)).toString()}**`, { embed: embed });
                    msg.reactions.removeAll();
                    msg.delete({ timeout: 15000 });
                };

                msg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
                    .catch(err => {
                        return message.channel.send(`**> :slight_smile:  ماذا تفعل هل تعرف كيف تلعب هذة اللعبة ${message.author}**`), msg.delete();
                    });
            });
        };

    },
};

const check = async (reaction, Random) => {
    const res1 = reaction.emoji.name;

    if (Random == res1) return ":frowning: لقد تعادلنا";
    if (Random == "🗻" && res1 == "📃") return ":partying_face: مبروك انت الفائز";
    if (Random == "🗻" && res1 == "✂️") return ":frowning: لقد خسرت";

    if (Random == "📃" && res1 == "✂️") return ":partying_face: مبروك انت الفائز";
    if (Random == "📃" && res1 == "🗻") return ":frowning: لقد خسرت";

    if (Random == "✂️" && res1 == "🗻") return ":partying_face: مبروك انت الفائز";
    if (Random == "✂️" && res1 == "📃") return ":frowning: لقد خسرت";
};

const checkHuman = async (player, player2) => {

    const res = data.get(player.id).choose;
    const res1 = data.get(player2.id).choose;

    if (res == res1) return `**:frowning: لقد تعادلتم [${player} - ${player2}]**`;

    if (res == "🗻" && res1 == "📃") return `**:partying_face: مبروك انت الفائز ${player2}**`;
    if (res == "🗻" && res1 == "✂️") return `**:partying_face: مبروك انت الفائز ${player}**`;

    if (res == "📃" && res1 == "✂️") return `**:partying_face: مبروك انت الفائز ${player2}**`;
    if (res == "📃" && res1 == "🗻") return `**:partying_face: مبروك انت الفائز ${player}**`;

    if (res == "✂️" && res1 == "🗻") return `**:partying_face: مبروك انت الفائز ${player2}**`;
    if (res == "✂️" && res1 == "📃") return `**:partying_face: مبروك انت الفائز ${player}**`;

};