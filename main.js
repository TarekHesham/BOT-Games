const Discord = require('discord.js');
const client = new Discord.Client();
const { token, owners, botID, serverID } = require('./config.json');
client.login(token).catch(err => console.log("Please check token bot... !!"));

client.commands = new Discord.Collection();
client.admin = new Discord.Collection();
client.games = new Discord.Collection();
client.about = new Discord.Collection();
client.owner = new Discord.Collection();

const fs = require('fs');

const folderAdmin = fs.readdirSync('./commands/admin/').filter(file => file.endsWith('.js'));
for (const files of folderAdmin) {
  const commands = require(`./commands/admin/${files}`);
  client.commands.set(commands.name, commands);
  client.admin.set(commands.name, commands);
};

const folderGames = fs.readdirSync('./commands/games/').filter(file => file.endsWith('.js'));
for (const file of folderGames) {
  const command = require(`./commands/games/${file}`);
  client.commands.set(command.name, command);
  client.games.set(command.name, command);
};

const folderAbout = fs.readdirSync('./commands/about/').filter(file => file.endsWith('.js'));
for (const files of folderAbout) {
  const commands = require(`./commands/about/${files}`);
  client.commands.set(commands.name, commands);
  client.about.set(commands.name, commands);
};

const folderOwner = fs.readdirSync('./commands/owner/').filter(file => file.endsWith('.js'));
for (const files of folderOwner) {
  const commands = require(`./commands/owner/${files}`);
  client.commands.set(commands.name, commands);
  client.owner.set(commands.name, commands);
};

require("./database/connect");
const { db, bs } = require("./database/connect");
const { setServers, setUsers, addVip, endVip, updateVip } = require("./database/data");

client.on('message', async message => {
  if (message.author.bot || !message.guild) return;
  if (message.content.toLowerCase().startsWith('!addvip')) {
    if (!owners.includes(message.author.id)) return;
    const args = message.content.split(' ').slice(1);
    if (args[0] == "help") return message.reply("**!addvip <ID Server> <ID Owner> <Month Count>**");
    if (!args[0]) return message.reply("**برجاء كتابة ايدي سيرفر**");
    if (!args[1]) return message.reply("**برجاء كتابة ايدي الاونر**");
    if (!args[2]) return message.reply("**برجاء كتابة عدد الاشهر**");

    await addVip(args[0], args[1], Date.now(), args[2], client.user.id);

    return message.channel.send("**☑️ | `VIP` تم إضافة السيرفر إلي الـ**");

  };

  if (message.content.toLowerCase().startsWith('!removevip')) {
    if (!owners.includes(message.author.id)) return;
    const args = message.content.split(' ').slice(1);
    if (!args) return message.reply("**!removevip <ID Server>**");
    if (args[0] == "help") return message.reply("**!removevip <ID Server>**");
    if (!args[0]) return message.reply("**برجاء كتابة ايدي سيرفر**");

    await endVip(args[0]);

    return message.channel.send("**☑️ | `VIP` تم حذف السيرفر من الـ**");

  };

  if (message.content.toLowerCase().startsWith('!updatevip')) {
    if (!owners.includes(message.author.id)) return;
    const args = message.content.split(' ').slice(1);
    if (args[0] == "help") return message.reply("**!updateVip <ID Server> <Months Count>**");
    if (!args[0]) return message.reply("**برجاء كتابة ايدي سيرفر**");
    if (!args[1]) return message.reply("**برجاء كتابة عدد الاشهر**");

    await updateVip(args[0], args[1]);

    return message.channel.send("**☑️ | `VIP` تم زيادة وقت الـ**");

  };

  if (message.content.toLowerCase().startsWith('!stop')) {
    if (!owners.includes(message.author.id)) return;
    await message.channel.send("**:x: | جاري إيقاف البوت...**");
    client.destroy();
  };

  db.query(`SELECT * FROM servers WHERE guild = "${message.guild.id}"`, async (err, req) => {
    if (err) throw err;
    if (req.length < 1 || !req[0]) return await setServers(message.guild.id);
    const prefix = req[0].prefix;
    const photo = req[0].style;
    const vip = req[0].vip;
    const time = req[0].time;
    const months = req[0].months;
    const bot = req[0].bot;
    const channelOnly = req[0].channel;
    
    if (channelOnly && channelOnly != "NULL") {
      const stringToArray = JSON.parse(req[0].channel);
      if (!stringToArray.includes(message.channel.id)) return;
    };

    if (vip && client.user.id == botID) return;

    if (bot != null && bot != client.user.id && botID != client.user.id && message.guild.id != serverID) return message.guild.leave();

    if (message.content.toLowerCase().includes(client.user.id)) {
      const command = await client.admin.find(m => m.name == 'prefix');
      if (command) return command.run(message);
    };

    if (!message.content.startsWith(prefix)) return;
    const [cmd] = message.content.toLocaleLowerCase().slice(prefix.length).split(' ');
    const args = message.content.split(' ').slice(1);
    // Commands Here
    const command = client.commands.find(command => command && command.name === cmd || command.aliases && command.aliases.includes(cmd));
    try {
      if (command && command.vip) {
        await setUsers(message.guild.id, message.author.id, message.author.tag);
        const date = 2592000000 * months - (Date.now() - time);
        if (vip != null && time != null && date > 0 || serverID === message.guild.id) {
          return command.run(message, args, client, photo);
        } else {
          if (!vip && client.user.id === botID) {
            return message.channel.send("**:x: | هذا السيرفر ليس مشترك في نظام البرميم**");
          } else if (date < 0 && client.user.id !== botID && serverID != message.guild.id) {
            await endVip(message.guild.id);
            if (client.user.id !== botID) {
              console.log(`offline now ${client.user.tag}....`);
              client.destroy();
            };
            return;
          };
        };
      } else {
        await setUsers(message.guild.id, message.author.id, message.author.tag);
        if (command && command.name == cmd) return command.run(message, args, client, photo);
        if (command && command.aliases && command.aliases.includes(cmd)) return command.run(message, args, client, photo);
      };
    } catch (err) {
      console.error(err);
    };

  });
});

client.on('ready', () => {
  console.clear();
  console.log(`Bot ${client.user.username} in Online ♥ ...`);

  db.query(`SELECT * FROM servers`, async (err, req) => {
    if (err) throw err;
    if (req.length < client.guilds.cache.size) {
      client.guilds.cache.forEach(server => {
        if (!req.includes(server.id)) {
          db.query(`INSERT INTO servers (guild, prefix, style, vip, time) VALUES ('${server.id}', '!', '3.png', null, null)`, (err) => {
            if (err) throw err;
          });
          bs.query(`CREATE TABLE IF NOT EXISTS \`${server.id}\` (
              \`member\` varchar(255) NOT NULL,
              \`points\` int(255) NOT NULL,
              PRIMARY KEY (\`member\`)
              ) ENGINE=InnoDB DEFAULT CHARSET=utf8`, async (err, req) => {
            if (err) throw err;
          });
        };
      });
    } else {
      return;
    };
  });

  db.query(`SELECT * FROM servers WHERE bot = "${client.user.id}"`, async (err, req) => {
    if (err) throw err;
    if (req.length >= 1) {
      client.guilds.cache.forEach(server => {
        if (client.user.id != botID && server.id != serverID && server.id != req[0].guild) return server.leave().then(console.log(`Out from ${server.name}}`));
      });
    } else {
      return;
    };
  });

});

client.on("guildCreate", server => {
  // حماية
  db.query(`SELECT * FROM servers WHERE bot = "${client.user.id}"`, async (err, req) => {
    if (err) throw err;
    if (req.length >= 1) {
      if (client.user.id != botID && server.id != serverID && server.id != req[0].guild) return server.leave();
    } else {
      return;
    };
  });

  // اضافة سيرفرات
  db.query(`SELECT * FROM servers WHERE guild = "${server.id}"`, async (err, req) => {
    if (err) throw err;
    if (req.length < 1) {
      sql = `INSERT INTO servers (guild, prefix, style, vip, time, bot) VALUES ("${server.id}", "!", "3.png", null, null, null)`;
      db.query(sql, (err) => {
        if (err) throw err;
      });
    } else {
      return;
    };
  });

  // اضافة سيرفرات
  bs.query(`CREATE TABLE IF NOT EXISTS \`${server.id}\` (
      \`member\` varchar(255) NOT NULL,
      \`points\` int(255) NOT NULL,
      PRIMARY KEY (\`member\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8`, async (err, req) => {
    if (err) throw err;
  });

});