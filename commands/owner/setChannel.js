const { db } = require("../../database/connect");
const { owners } = require("../../config.json");

module.exports = {
    name: 'setchannel',
    description: 'تقوم روم خاصة بالبوت',
    aliases: ['sc'],
    vip: true,
    run: async (message, args, client) => {
        if (owners.includes(message.author.id) || message.guild.owner == message.author.id || req[0].owner == message.author.id) {
            message.channel.send(`**
>>> 1 I لعرض الشاتات المسموح بإستقبال الاوامر منها
2 I لإضافة شات جديد
3 I لحذف شات
0 I للإلغاء
**`).then(async msg => {
                const filter = user => user.author.id === message.author.id;
                msg.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] })
                    .then(async collected => {
                        const content = collected.first().content;
                        if (content == 1) {
                            db.query(`SELECT * FROM servers WHERE guild = "${message.guild.id}"`, async (err, req) => {
                                if (err) throw err;
                                if (!req[0]) return;

                                if (req[0].channel != "NULL") {
                                    const da = JSON.parse(req[0].channel).map((data, index) => `> \`#${index+=1}\` <#${data}>`);
                                    message.channel.send(`**الشاتات المسموح باستخدام البوت بها**\n${da.join('\n')}`);
                                    return;
                                };
                                if (req[0].channel == "NULL") return message.channel.send("> **لا يوجد اي شات تم تحديده**");
                            });
                            return;
                        } else if (content == 2) {
                            message.channel.send("> **برجاء منشنة الشات او كتابة اسمه**").then(async m => {
                                m.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] })
                                .then(async coll => {
                                    const rom = coll.first().mentions.channels.first() ? coll.first().mentions.channels.first().name : coll.first().content;
                                    const roomm = message.guild.channels.cache.find(ch => ch.name == rom);
                                    if (!roomm) return message.channel.send("> **لم اتمكن من العثور علي هذا الشات**");
                                    await setChannels(roomm.id, message.guild.id);
                                    message.channel.send("> **تم تحديد الشات بنجاح**");
                                })
                                .catch(err => console.log(err));
                            });
                            return;
                        } else if (content == 3) {
                            message.channel.send("> **برجاء منشنة الشات او كتابة اسمه**").then(async m => {
                                m.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] })
                                .then(async coll => {
                                    const rom = coll.first().mentions.channels.first() ? coll.first().mentions.channels.first().name : coll.first().content;
                                    const roomm = message.guild.channels.cache.find(ch => ch.name == rom);
                                    if (!roomm) return message.channel.send("> **لم اتمكن من العثور علي هذا الشات**");
                                    await removeChannels(roomm.id, message.guild.id);
                                    message.channel.send("> **تم إلغاء حديد الشات بنجاح**");
                                })
                                .catch(err => console.log(err));
                            });
                            return;
                        } else {
                            return message.channel.send("> **تم إلغاء الامر**");
                        };
                    })
                    .catch(errors => console.log(""));
            });
        };
    },
};

const setChannels = async (channelID, guildID) => {
    db.query(`SELECT * FROM servers WHERE guild = "${guildID}"`, async (err, req) => {
        if (err) throw err;
        if (!req[0]) return;

        const channelsList = req[0].channel != "NULL" ? JSON.parse(req[0].channel) : [];

        await channelsList.push(channelID);

        const toStore = JSON.stringify(channelsList);

        db.query(`UPDATE servers SET channel = '${toStore}' WHERE guild = "${guildID}"`, (err) => {
            if (err) throw err;
        });

    });
};

const removeChannels = async (channelID, guildID) => {
    db.query(`SELECT * FROM servers WHERE guild = "${guildID}"`, async (err, req) => {
        if (err) throw err;
        if (!req[0]) return;
        if (req[0].channel == "NULL") return;
        const channelsList = JSON.parse(req[0].channel);

        await channelsList.splice(channelsList.indexOf(channelID), 1);
        let toStore = JSON.stringify(channelsList);
        if (channelsList.length < 1) toStore = "NULL";
        db.query(`UPDATE servers SET channel = '${toStore}' WHERE guild = "${guildID}"`, (err) => {
            if (err) throw err;
        });

    });
};