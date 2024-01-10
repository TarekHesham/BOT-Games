const { updatePointsUser, updatePointsServer } = require("../../database/data");
const isPlaying = new Set();

module.exports = {
    name: 'time',
    description: 'خمن الوقت و كن الفائز',
    aliases: ['وقت'],
    run: async (message) => {
        if (isPlaying.has(message.channel.id)) return message.channel.send("هناك جولة بالفعل! | :x:");

        let date = Date.now();
        let random = Math.floor(Math.random() * 14);
        let reply = `> **خمن ${random} ثانية الان و اكتب \`الان\` للفوز**`;
        let filter = m => m.content === 'الان';
        message.channel.send(reply).then(() => {
            isPlaying.add(message.channel.id);

            setTimeout(() => {
                message.channel.awaitMessages(filter, { max: 1, time: (15000 - random * 1000), errors: ["time"] })
                    .then(collected => {
                        isPlaying.delete(message.channel.id);
                        message.channel.send(`> **مبروك! الفائز هو ${collected.first().author} ، قام بتخمين الوقت  قبل \`${(((date + 15000) - Date.now()) / 1000).toFixed(1)}\` ثواني!**`);
                        updatePointsUser(message.author.id), updatePointsServer(message.guild.id, message.author.id);

                    })
                    .catch(errors => {
                        isPlaying.delete(message.channel.id);
                        message.channel.send("\n> **انتهى الوقت ، لم يفز أحد...**");
                    });
            }, random * 1000);
        });
    },
};