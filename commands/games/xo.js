const data = new Map();
const safe = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
const game = ["❌", "⭕"];
module.exports = {
    name: 'xo',
    description: 'أكس او مع صديقك',
    aliases: ['ttt', 'ox'],
    run: async (message) => {
        const user1 = message.author.id;
        if (data.has(user1)) return message.channel.send(`**> يجب انهاء الجولة الحالية مع <@${data.get(user1).vs}> لبداء جولة جديدة**`);
        let board = ["1️⃣", "2️⃣", "3️⃣", "\n", "4️⃣", "5️⃣", "6️⃣", "\n", "7️⃣", "8️⃣", "9️⃣"];
        const user2 = message.mentions.users.first();

        if (!user2) return message.reply("**:x: | منشن الخصم لبداء اللعبة.**");
        if (user2.bot) return message.reply("**:x: | كيف تبي تلعب مع بوت ي ذكي :]**");
        if (user2.id == user1) return message.reply("**:x: | لا جد جد كيف تبي تلعب مع نفسك؟, نفسيه انت؟. :]**");
        data.set(user1, { vs: user2.id });
        message.channel.send(board.join('')).then(async msg => {

            message.channel.send(`**[${message.author} VS ${user2}]**\nالرجاء الانتظار لحين تجهيز الجولة`).then(async ms => {

                for (let i = 0; i < safe.length; i++) await msg.react(safe[i]).catch(err => console.log());

                data.set(msg.id, { players: [user1, user2.id], nowPlay: 0, newGame: false });

                ms.edit(`**[${game[data.get(msg.id).nowPlay]}] دورك : [<@${data.get(msg.id).players[data.get(msg.id).nowPlay]}>]**`);
                setInterval(async () => {

                    if (!data.has(msg.id)) return clearInterval();

                    if (data.get(msg.id).newGame == false) return;

                    data.get(msg.id).newGame = false;

                    board = ["1️⃣", "2️⃣", "3️⃣", "\n", "4️⃣", "5️⃣", "6️⃣", "\n", "7️⃣", "8️⃣", "9️⃣"];

                    msg.edit(board.join(''));

                    setTimeout(async () => {
                        await ms.edit(`**[${game[data.get(msg.id).nowPlay]}] دورك : [<@${data.get(msg.id).players[data.get(msg.id).nowPlay]}>]**`);
                    }, 6000);

                }, 3000);

                const filter = async (reaction, user) => {

                    if (!data.has(msg.id)) return;
                    if (data.get(msg.id).newGame == true) return;
                    if (!safe.includes(reaction.emoji.name) || !board.includes(reaction.emoji.name)) return reaction.users.remove(user);

                    if (data.get(msg.id).players[data.get(msg.id).nowPlay] != user.id) return reaction.users.remove(user);

                    let index = board.indexOf(reaction.emoji.name);

                    board[index] = game[data.get(msg.id).nowPlay];

                    msg.edit(board.join(''));

                    if (board[0] == board[1] && board[1] == board[2]) return end(msg, ms, user1);
                    else if (board[4] == board[5] && board[5] == board[6]) return end(msg, ms, user1);
                    else if (board[8] == board[9] && board[9] == board[10]) return end(msg, ms, user1);
                    else if (board[0] == board[5] && board[5] == board[10]) return end(msg, ms, user1);
                    else if (board[2] == board[5] && board[5] == board[8]) return end(msg, ms, user1);
                    else if (board[1] == board[5] && board[5] == board[9]) return end(msg, ms, user1);
                    else if (board[0] == board[4] && board[4] == board[8]) return end(msg, ms, user1);
                    else if (board[2] == board[6] && board[6] == board[10]) return end(msg, ms, user1);
                    else if (board.filter(item => safe.includes(item)).length < 1) return ms.edit(`> **تعادل**\n**هل تريد اللعب مجدداً؟**`), quest(msg, ms, user1);
                    else {
                        let cache = data.get(msg.id).nowPlay;
                        if (cache == 0) return data.get(msg.id).nowPlay = 1, ms.edit(`**[${game[data.get(msg.id).nowPlay]}] دورك : [<@${data.get(msg.id).players[data.get(msg.id).nowPlay]}>]**`);
                        if (cache == 1) return data.get(msg.id).nowPlay = 0, ms.edit(`**[${game[data.get(msg.id).nowPlay]}] دورك : [<@${data.get(msg.id).players[data.get(msg.id).nowPlay]}>]**`);
                    };
                };

                const collector = msg.createReactionCollector(filter, { time: 240000 });
                collector.on("end", () => {
                        if (!data.has(msg.id)) return;
                        ms.edit(`**تم إنتهاء مدة اللعبة برجاء البدء لعبة جديدة [${message.author} - ${user2}]**`);
                        data.delete(user1);
                        data.delete(msg.id);
                        msg.reactions.removeAll();
                        msg.delete();
                        collector.stop();
                    });
            });
        });
    },
};
const end = async (msg, ms, user1) => {
    await ms.edit(`> **<@${data.get(msg.id).players[data.get(msg.id).nowPlay]}> الفائز هو: **\n**هل تريد اللعب مجدداً؟**`);
    return quest(msg, ms, user1);
};

const quest = async (msg, ms, user1) => {

    const questReact = ["✅", "❌"];

    for (const emoji of questReact) await ms.react(emoji);

    const filterquest = (reaction, user) => {
        return questReact.includes(reaction.emoji.name) && data.get(msg.id).players.includes(user.id);
    };

    ms.awaitReactions(filterquest, { max: 1, time: 30000, errors: ['time'] })
        .then(async collected => {
            const reactionQuest = collected.first();
            if (reactionQuest._emoji.name === questReact[0]) {
                ms.edit('**برجاء الانتظار حتي تجهيز الجولة الجديدة**');
                msg.reactions.cache.forEach(async res => {
                    const user = res.users.cache.find(u => u.id != ms.author.id);
                    if (user) await res.users.remove(user);
                    await ms.reactions.removeAll();
                    data.get(msg.id).newGame = true;
                });
            } else if (reactionQuest._emoji.name === questReact[1]) {
                ms.edit(`**شكراً للعب معنا [<@${data.get(msg.id).players[0]}> - <@${data.get(msg.id).players[1]}>]**`);
                setTimeout(() => {
                    msg.delete();
                    ms.reactions.removeAll();
                    ms.delete({timeout: 10000});
                    data.delete(user1);
                    data.delete(msg.id);
                }, 3000);
                return;
            };
        })
        .catch(err => {
            if (!data.has(msg.id)) return;
            ms.edit(`**تم إنهاء اللعبة لعدم التفاعل [<@${data.get(msg.id).players[0]}> - <@${data.get(msg.id).players[1]}>]**`);
            setTimeout(() => {
                ms.delete();
                msg.delete();
                data.delete(user1);
                data.delete(msg.id);
            }, 5000);
            return;
        });
};