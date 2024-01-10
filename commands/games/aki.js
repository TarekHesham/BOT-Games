module.exports = {
    name: 'aki',
    description: 'اسئل المارد السحري',
    aliases: ['المارد'],
    vip: true,
    run: async (message, args, client) => {
        const memberID = message.author.id;
        if (isPlaying.has(memberID)) return message.channel.send("هناك جولة بالفعل! | :x:").then(m => m.delete({ timeout: 3000 }));
        isPlaying.add(memberID);

        message.reply('جاري تجهيز اللعبة الرجاء الإنتظار...').then(m => m.delete({ timeout: 10000 }));;

        const aki = new Aki("ar"); // Full languages list at: https://github.com/jgoralcz/aki-api
        await aki.start();
        const Embed = new Discord.MessageEmbed()
            .setTitle(aki.question)
            .setColor(colorEmbed)
            .setDescription(`${aki.answers.map((an, i) => `**${an} I ${emojis[i]}**`).join("\n")}\n**:x: I إضغط لإنهاء الجولة**`);

        const msg = await message.channel.send(`|| ${message.author} ||`, { embed: Embed });

        for (const emoji of emojis) await msg.react(emoji);

        const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && user.id == memberID;

        const collector = msg.createReactionCollector(filter, { time: 60000 * 6 });

        collector.on("end", () => null);
        collector.on("collect", async ({ emoji, users }) => {
            users.remove(message.author).catch(() => null);
            if (emoji.name == "❌") return collector.stop(), msg.delete(), isPlaying.delete(memberID);

            await aki.step(emojis.indexOf(emoji.name));

            if (aki.progress >= 70 || aki.currentStep >= 78) {
                await aki.win();
                collector.stop();
                let choose = 0;
                const embed = new Discord.MessageEmbed()
                    .setTitle("أنت تفكر في")
                    .setColor(colorEmbed)
                    .setDescription(`**${aki.answers[choose].name}**\n**__${aki.answers[choose].description}__**`)
                    .setImage(aki.answers[choose].absolute_picture_path);
                await msg.reactions.removeAll();

                msg.edit(`|| ${message.author} ||`, { embed: embed });

                const endd = ["✅", "❌"];

                for (const emoji of endd) await msg.react(emoji);

                const filterquest = (reaction, user) => {
                    return endd.includes(reaction.emoji.name) && user.id == memberID;
                };

                const collectorr = msg.createReactionCollector(filterquest, { time: 60000 * 4 });
                collectorr.on("collect", async ({ emoji, users }) => {
                    users.remove(message.author).catch(() => null);
                    const isWinner = emoji.name === "✅";
                    if (isWinner) {
                        collectorr.stop();
                        isPlaying.delete(memberID);
                        embed.setFooter(`لقد قمت بتخمين شخصيتك بعد ${aki.currentStep} مرات`);
                        msg.edit(`|| ${message.author} ||`, { embed: embed });
                        msg.reactions.removeAll();
                        return;
                    } else {
                        if (choose < aki.answers.length - 1) {
                            choose++;
                            embed.setDescription(`**${aki.answers[choose].name}**\n**__${aki.answers[choose].description ? aki.answers[choose].description : " "}__**`)
                                .setImage(aki.answers[choose].absolute_picture_path);
                            msg.edit(`|| ${message.author} ||`, { embed: embed });
                        } else {
                            collectorr.stop();
                            const em = new Discord.MessageEmbed()
                                .setColor(colorEmbed)
                                .setTitle("مبروك لقد فزت علي , لم استطيع تخمين من تفكر فيه  :(");
                            msg.edit(`|| ${message.author} ||`, { embed: em });
                            msg.reactions.removeAll();
                            isPlaying.delete(memberID);
                            return;
                        };
                    };
                })
                collectorr.on("end", () => null);
            } else {
                const x = Math.floor(aki.progress) / 10;
                let y = '';
                let z = '';
                for (let i = 0; i < x; i++) y += "▬";
                for (let i = 0; i < 10 - x; i++) z += "=";
                const emb = new Discord.MessageEmbed()
                    .setTitle(aki.question)
                    .setColor(colorEmbed)
                    .setDescription(`${aki.answers.map((an, i) => `**${an} I ${emojis[i]}**`).join("\n")}\n**:x: I إضغط لإنهاء الجولة**`)
                    .setFooter(`${y}🔸${z} ${Math.floor(aki.progress)}%`);
                msg.edit(`|| ${message.author} ||`, { embed: emb });
            }
        });
    },
};
const Discord = require('discord.js');
const isPlaying = new Set();
const { Aki } = require("aki-api");
const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "❌"];

const { colorEmbed } = require("../../config.json");