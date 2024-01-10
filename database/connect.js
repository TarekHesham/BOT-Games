const { createPool } = require('mysql');

const db = createPool({
    connectionLimit: 10,
    host: "46.36.39.243",
    password: "Zqer-Sdi@-#skd-F@sd",
    user: "root",
    database: "gamesbot"
});

const bs = createPool({
    connectionLimit: 10,
    host: "46.36.39.243",
    password: "Zqer-Sdi@-#skd-F@sd",
    user: "root",
    database: "boardservers"
});

db.on('connection', function (connection) {
    console.log('DB Connection gamesbot...');
    connection.on('error', function (err) {
        console.error(new Date(), 'MySQL error', err.code);
    });
    connection.on('close', function (err) {
        console.error(new Date(), 'MySQL close', err);
    });
});

bs.on('connection', function (connection) {
    console.log('DB Connection boardservers...');
    connection.on('error', function (err) {
        console.error(new Date(), 'MySQL error', err.code);
    });
    connection.on('close', function (err) {
        console.error(new Date(), 'MySQL close', err);
    });
});

//           CREATE DATABASE IF NOT EXISTS 'gamesbot' [ servers - users - vip ];

// اضافة جدول السيرفر
db.query(`CREATE TABLE IF NOT EXISTS \`vip\` (
    \`id\` varchar(255) NOT NULL,
    \`owner\` varchar(255) NOT NULL,
    \`time\` varchar(255) DEFAULT NULL,
    \`server\` varchar(255) NOT NULL,
    \`months\` varchar(255) DEFAULT NULL,
    PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8`, async (err, req) => {
    if (err) throw err;
});

// اضافة جدول السيرفر
db.query(`CREATE TABLE IF NOT EXISTS \`servers\` (
    \`guild\` varchar(255) NOT NULL,
    \`style\` varchar(255) NOT NULL,
    \`prefix\` varchar(255) NOT NULL,
    \`vip\` varchar(255) DEFAULT NULL,
    \`time\` varchar(255) DEFAULT NULL,
    \`months\` varchar(255) DEFAULT NULL,
    \`bot\` varchar(255) DEFAULT NULL,
    PRIMARY KEY (\`guild\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8`, async (err, req) => {
    if (err) throw err;
});

// اضافة جدول السيرفر
db.query(`CREATE TABLE IF NOT EXISTS \`users\` (
    \`user\` varchar(255) NOT NULL,
    \`points\` int(255) NULL,
    \`username\` varchar(255) NULL,
    PRIMARY KEY (\`user\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8`, async (err, req) => {
    if (err) throw err;
});

// servers [ guild - style - prefix - vip - time - months ] 
// users [ user - points - username ] 
// vip [ id - owner - time - server - months ]

//           CREATE DATABASE IF NOT EXISTS 'boardservers';

module.exports = {
    "db": db,
    "bs": bs // boardServers
};