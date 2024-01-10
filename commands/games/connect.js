const { MessageEmbed } = require("discord.js");
const { colorEmbed } = require("../../config.json");

module.exports = {
    name: 'connect',
    description: 'وصل 4 و فوز على صديقك',
    aliases: ["4inrow", "4", "توصيل"],
    vip: true,
    run: async (message) => {
        const challenger = message.author;
        const oppenent = message.mentions.users.first();

        if (!oppenent) return message.reply("**:x: | منشن الخصم لبداء اللعبة.**");
        if (oppenent && oppenent.bot) return message.reply("**:x: | كيف تبي تلعب مع بوت ي ذكي :]**");
        if (oppenent.id == message.author.id) return message.reply("**:x: | لا جد جد كيف تبي تلعب مع نفسك؟, نفسيه انت؟. :]**");

        const question = await message.channel.send(`${oppenent}, هل ترغب في لعب توصيل أربعة ضد ${challenger}?`);

        
        ["✅", "❌"].forEach(async el => await question.react(el));

        const filter = (reaction, user) => ["✅", "❌"].includes(reaction.emoji.name) && user.id === oppenent.id;

        const response = await question.awaitReactions(filter, { max: 1 });

        const reaction = response.first();

        if (reaction.emoji.name === "❌") return question.edit("يبدو أنه لا يريد اللعب");

        else {

            await message.delete();
            await question.delete();

            const board = [
                ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"],
                ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"],
                ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"],
                ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"],
                ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"],
                ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"],
            ];

            const renderBoard = (board) => {
                let tempString = "";
                for (const boardSection of board) {
                    tempString += `${boardSection.join("")}\n`;
                }

                tempString = tempString.concat("1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣");

                return tempString;
            }

            const initialState = renderBoard(board);

            const initial = new MessageEmbed().setColor(colorEmbed)
                .setDescription(initialState);

            const gameMessage = await message.channel.send(`**الان انت ستختار : ${message.author}**`, {embed: initial});

            ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣"].forEach(async el => gameMessage.react(el));

            const gameFilter = (reaction, user) => ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣"].includes(reaction.emoji.name) && (user.id === oppenent.id || user.id === challenger.id);

            const gameCollector = gameMessage.createReactionCollector(gameFilter);

            const gameData = [
                { member: challenger, playerColor: "🔴" },
                { member: oppenent, playerColor: "🟡" }
            ];

            let player = 0;


            const checkFour = (a, b, c, d) => (a === b) && (b === c) && (c === d) && (a !== "⚪");

            const horizontalCheck = () => {
                for (let i = 0; i < 6; i++) {
                    for (let j = 0; j < 4; j++) {
                        if (checkFour(board[i][j], board[i][j + 1], board[i][j + 2], board[i][j + 3])) return [
                            board[i][j], board[i][j + 1], board[i][j + 2], board[i][j + 3]
                        ];
                    }
                }
            }

            const verticalCheck = () => {
                for (let j = 0; j < 7; j++) {
                    for (let i = 0; i < 3; i++) {
                        if (checkFour(board[i][j], board[i + 1][j], board[i + 2][j], board[i + 3][j])) return [
                            board[i][j], board[i + 1][j], board[i + 2][j], board[i + 3][j]
                        ];
                    }
                }
            }

            const diagonal1 = () => {
                for (let col = 0; col < 4; col++) {
                    for (let row = 0; row < 3; row++) {
                        if (checkFour(board[row][col], board[row + 1][col + 1], board[row + 2][col + 2], board[row + 3][col + 3])) return [
                            board[row][col], board[row + 1][col + 1], board[row + 2], board[col + 2], board[row + 3][col + 3]
                        ]
                    }
                }
            }

            const diagonal2 = () => {
                for (let col = 0; col < 4; col++) {
                    for (let row = 5; row > 2; row--) {
                        if (checkFour(board[row][col], board[row - 1][col + 1], board[row - 2][col + 2], board[row - 3][col + 3])) return [
                            board[row][col], board[row - 1][col + 1], board[row - 2][col + 2], board[row - 3][col + 3]
                        ]
                    }
                }
            }

            const tieCheck = () => {
                let count = 0;
                for (const el of board) {
                    for (const string of el) {
                        if (string !== "⚪") count++;
                    }
                }
                if (count === 42) return true;
                else return false;
            }

            const checks = [horizontalCheck, verticalCheck, diagonal1, diagonal2];

            gameCollector.on("collect", async (reaction, user) => {

                await reaction.users.remove(user);
                if (user.id === gameData[player].member.id) {
                    
                    const openSpaces = [];


                    switch (reaction.emoji.name) {

                        case "1️⃣":

                            for (let i = 5; i > -1; i--) {
                                if (board[i][0] === "⚪") openSpaces.push({ i, j: 0 });
                            }
                            if (openSpaces.length === 0) return message.channel.send(`${gameData[player].member}, هذا العمود ممتلئ بالفعل. اختر واحدة مختلفة.`);
                            else board[openSpaces[0].i][openSpaces[0].j] = gameData[player].playerColor;

                            break;
                        case "2️⃣":

                            for (let i = 5; i > -1; i--) {
                                if (board[i][1] === "⚪") openSpaces.push({ i, j: 1 });
                            }
                            if (openSpaces.length === 0) return message.channel.send(`${gameData[player].member}, هذا العمود ممتلئ بالفعل. اختر واحدة مختلفة.`);
                            else board[openSpaces[0].i][openSpaces[0].j] = gameData[player].playerColor;

                            break;
                        case "3️⃣":
                            for (let i = 5; i > -1; i--) {
                                if (board[i][2] === "⚪") openSpaces.push({ i, j: 2 });
                            }
                            if (openSpaces.length === 0) return message.channel.send(`${gameData[player].member}, هذا العمود ممتلئ بالفعل. اختر واحدة مختلفة.`);
                            else board[openSpaces[0].i][openSpaces[0].j] = gameData[player].playerColor;
                            break;
                        case "4️⃣":
                            for (let i = 5; i > -1; i--) {
                                if (board[i][3] === "⚪") openSpaces.push({ i, j: 3 });
                            }
                            if (openSpaces.length === 0) return message.channel.send(`${gameData[player].member}, هذا العمود ممتلئ بالفعل. اختر واحدة مختلفة.`);
                            else board[openSpaces[0].i][openSpaces[0].j] = gameData[player].playerColor;
                            break;
                        case "5️⃣":
                            for (let i = 5; i > -1; i--) {
                                if (board[i][4] === "⚪") openSpaces.push({ i, j: 4 });
                            }
                            if (openSpaces.length === 0) return message.channel.send(`${gameData[player].member}, هذا العمود ممتلئ بالفعل. اختر واحدة مختلفة.`);
                            else board[openSpaces[0].i][openSpaces[0].j] = gameData[player].playerColor;
                            break;
                        case "6️⃣":
                            for (let i = 5; i > -1; i--) {
                                if (board[i][5] === "⚪") openSpaces.push({ i, j: 5 });
                            }
                            if (openSpaces.length === 0) return message.channel.send(`${gameData[player].member}, هذا العمود ممتلئ بالفعل. اختر واحدة مختلفة.`);
                            else board[openSpaces[0].i][openSpaces[0].j] = gameData[player].playerColor;
                            break;
                        case "7️⃣":
                            for (let i = 5; i > -1; i--) {
                                if (board[i][6] === "⚪") openSpaces.push({ i, j: 6 });
                            }
                            if (openSpaces.length === 0) return message.channel.send(`${gameData[player].member}, هذا العمود ممتلئ بالفعل. اختر واحدة مختلفة.`);
                            else board[openSpaces[0].i][openSpaces[0].j] = gameData[player].playerColor;
                            break;

                    }

                    if (tieCheck()) {

                        const TieEmbed = new MessageEmbed().setColor(colorEmbed)
                            .setDescription(renderBoard(board))
                        gameCollector.stop("Tie Game");
                        gameMessage.reactions.removeAll();
                        return gameMessage.edit(`**تعادل اللاعبين !!**`, { embed: TieEmbed });

                    }

                    for (const func of checks) {

                        const data = func();
                        if (data) {

                            const WinEmbed = new MessageEmbed().setColor(colorEmbed)
                                .setDescription(renderBoard(board))
                            gameCollector.stop(`${gameData[player].member.id} won`);
                            gameMessage.reactions.removeAll();
                            return gameMessage.edit(`**قد فاز في المباراة : ${gameData[player].member}**`, { embed: WinEmbed });

                        }

                    }

                    player = (player + 1) % 2;

                    const newEmbed = new MessageEmbed()
                        .setColor(colorEmbed)
                        .setDescription(renderBoard(board));

                    gameMessage.edit(`**الان انت ستختار : <@${gameData[player].member.id}>**`, { embed: newEmbed });

                };

            });


        }

    },
};