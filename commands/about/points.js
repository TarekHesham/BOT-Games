const { bs } = require("../../database/connect");

module.exports = {
    name: 'points',
    description: 'لعرض نقاطك بالسيرفر',
    aliases: ['نقاطي'],
    run: async (message, args, client) => {

        bs.query(`SELECT points FROM \`${message.guild.id}\` WHERE member = '${message.author.id}'`, async (err, res) => {
            const data = await res;
            return message.channel.send(`> **[🎖️] مجموع نقاطك هوا \`${data[0].points}\` نقطة **`);
        });
    },
};