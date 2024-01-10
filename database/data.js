const { db, bs } = require('./connect');
const { prefix } = require('../config.json');
const hashe = require("./base64");

let sql;
module.exports = {
    setAll: async (guildID, memberID, member) => {
        // اضافة مستخدمين
        db.query(`SELECT * FROM users WHERE user = "${memberID}"`, async (err, req) => {
            if (err) throw err;
            if (req.length < 1) {
                const data = hashe.encode(member.toString());
                sql = `INSERT INTO users (user, points, username) VALUES ("${memberID}", 0,"${data}")`;
                db.query(sql, (err) => {
                    if (err) throw err;
                });
            } else {
                return;
            };
        });

        // اضافة سيرفرات
        db.query(`SELECT * FROM servers WHERE guild = "${guildID}"`, async (err, req) => {
            if (err) throw err;
            if (req.length < 1) {
                sql = `INSERT INTO servers (guild, prefix, style) VALUES ("${guildID}", "${prefix}", "3.png")`;
                db.query(sql, (err) => {
                    if (err) throw err;
                });
            } else {
                return;
            };
        });

        // اضافة جدول السيرفر
        bs.query(`CREATE TABLE IF NOT EXISTS \`${guildID}\` (
            \`member\` varchar(255) NOT NULL,
            \`points\` int(255) NOT NULL,
            PRIMARY KEY (\`member\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8`, async (err, req) => {
            if (err) throw err;
        });

        // اضافة اعضاء السيرفر
        bs.query(`SELECT * FROM \`${guildID}\` WHERE member = '${memberID}'`, async (err, req) => {
            if (err) throw err;
            if (req.length < 1) {
                bs.query(`INSERT INTO \`${guildID}\` (member, points) VALUES ('${memberID}', 0)`, (err) => {
                    if (err) throw err;
                });
            } else {
                return;
            };
        });

        // اضافة اسامي الاعضاء
        db.query(`SELECT * FROM users WHERE user = "${memberID}"`, async (err, req) => {
            if (err) throw err;
            if (!req[0]) return;
            try {
                const data = hashe.encode(member.toString());
                if (req[0].username == data) return;
                await db.query(`UPDATE users SET username = "${data}" WHERE user = "${memberID}"`, (err) => {
                    if (err) throw err;
                });
            } catch (err) {
                console.log(err);
            };
        });

    },
    setUsers: async (guildID, memberID, member) => {
        // اضافة مستخدمين
        db.query(`INSERT IGNORE INTO users (user, points) VALUES ('${memberID}', 0)`, async (err, req) => {
            if (err) throw err;
        });

        // اضافة اعضاء السيرفر
        bs.query(`INSERT IGNORE INTO \`${guildID}\` (member, points) VALUES ('${memberID}', 0)`, async (err, req) => {
            if (err) throw err;
        });

        // اضافة اسامي الاعضاء
        db.query(`SELECT * FROM users WHERE user = "${memberID}"`, async (err, req) => {
            if (err) throw err;
            if (!req[0]) return;
            try {
                const data = hashe.encode(member.toString());
                if (req[0].username == data) return;
                await db.query(`UPDATE users SET username = "${data}" WHERE user = "${memberID}"`, (err) => {
                    if (err) throw err;
                });
            } catch (err) {
                console.log(err);
            };
        });
    },
    setServers: async (guildID) => {
        // اضافة سيرفرات
        db.query(`INSERT IGNORE INTO servers (guild, prefix, style) VALUES ("${guildID}", "${prefix}", "3.png")`, async (err, req) => {
            if (err) throw err;
        });

        // اضافة جدول السيرفر
        bs.query(`CREATE TABLE IF NOT EXISTS \`${guildID}\` (
            \`member\` varchar(255) NOT NULL,
            \`points\` int(255) NOT NULL,
            PRIMARY KEY (\`member\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8`, async (err, req) => {
            if (err) throw err;
        });
    },
    updatePointsUser: async (memberID) => {
        db.query(`SELECT * FROM users WHERE user = "${memberID}"`, async (err, req) => {
            if (err) throw err;
            if (!req[0]) return;
            const points = await req[0].points;
            sql = `UPDATE users SET points = ${parseInt(points + 1)} WHERE user = "${memberID}"`;
            db.query(sql, (err) => {
                if (err) throw err;
            });
        });
    },
    updatePointsServer: async (guildID, memberID) => {
        bs.query(`SELECT * FROM \`${guildID}\` WHERE member = '${memberID}'`, async (err, req) => {
            if (err) throw err;
            if (!req[0]) return;
            const points = await req[0].points;
            sql = `UPDATE \`${guildID}\` SET points = ${parseInt(points + 1)} WHERE member = '${memberID}'`;
            bs.query(sql, (err) => {
                if (err) throw err;
            });
        });
    },
    updatePrefix: async (guildID, prefix) => {
        db.query(`SELECT prefix FROM servers WHERE guild = "${guildID}"`, async (err, req) => {
            if (err) throw err;
            if (!req[0]) return;
            sql = `UPDATE servers SET prefix = '${prefix}' WHERE guild = '${guildID}'`;
            db.query(sql, (err) => {
                if (err) throw err;
            });
        });
    },
    updateStyle: async (guildID, style) => {
        db.query(`SELECT style FROM servers WHERE guild = "${guildID}"`, async (err, req) => {
            if (err) throw err;
            if (!req[0]) return;
            sql = `UPDATE servers SET style = '${style}' WHERE guild = '${guildID}'`;
            db.query(sql, (err) => {
                if (err) throw err;
            });
        });
    },
    endVip: async (guildID) => {
        db.query(`SELECT * FROM servers WHERE guild = "${guildID}"`, async (err, req) => {
            if (err) throw err;
            if (!req[0]) return;
            sql = `UPDATE servers SET time = NULL WHERE guild = "${guildID}"`;
            db.query(sql, (err) => {
                if (err) throw err;
            });

            sql = `UPDATE servers SET vip = NULL WHERE guild = "${guildID}"`;
            db.query(sql, (err) => {
                if (err) throw err;
            });

            sql = `UPDATE servers SET months = NULL WHERE guild = "${guildID}"`;
            db.query(sql, (err) => {
                if (err) throw err;
            });

            sql = `UPDATE servers SET bot = NULL WHERE guild = "${guildID}"`;
            db.query(sql, (err) => {
                if (err) throw err;
            });
        });

        // تعديل الوقت في جدول الـ VIP
        db.query(`SELECT * FROM vip WHERE id = "${guildID}"`, async (err, req) => {
            if (err) throw err;
            if (!req[0]) return;

            sql = `DELETE FROM vip WHERE id = "${guildID}"`;
            db.query(sql, (err) => {
                if (err) throw err;
            });
        });

    },
    addVip: async (guildID, memberID, TIME, MONTHS, botID) => {

        // اضافة السيرفر في جدول الـ vip
        db.query(`SELECT * FROM vip WHERE id = "${guildID}"`, async (err, req) => {
            if (err) throw err;
            if (req.length < 1) {
                sql = `INSERT INTO vip (id, owner, time, server, months) VALUES ("${guildID}", "${memberID}", "${TIME}", "${guildID}", "${MONTHS}")`;
                db.query(sql, (err) => {
                    if (err) throw err;
                });
            } else {
                return;
            };
        });

        // تعديل الوقت في جدول الـ servers
        db.query(`SELECT * FROM servers WHERE guild = "${guildID}"`, async (err, req) => {
            if (err) throw err;
            if (!req[0]) return;

            sql = `UPDATE servers SET time = "${TIME}" WHERE guild = "${guildID}"`;
            db.query(sql, (err) => {
                if (err) throw err;
            });

            sql = `UPDATE servers SET vip = true WHERE guild = "${guildID}"`;
            db.query(sql, (err) => {
                if (err) throw err;
            });

            sql = `UPDATE servers SET months = "${MONTHS}" WHERE guild = "${guildID}"`;
            db.query(sql, (err) => {
                if (err) throw err;
            });

            sql = `UPDATE servers SET bot = "${botID}" WHERE guild = "${guildID}"`;
            db.query(sql, (err) => {
                if (err) throw err;
            });
        });

    },
    updateVip: async (guildID, MONTHS) => {
        // تعديل الوقت في جدول الـ VIP
        db.query(`SELECT * FROM vip WHERE id = "${guildID}"`, async (err, req) => {
            if (err) throw err;
            if (!req[0]) return;
            const months = req[0].months;
            const add = parseInt(months) + parseInt(MONTHS);
            sql = `UPDATE vip SET months = "${add}" WHERE server = "${guildID}"`;
            db.query(sql, (err) => {
                if (err) throw err;
            });

        });

        // تعديل الوقت في جدول الـ servers
        db.query(`SELECT * FROM servers WHERE guild = "${guildID}"`, async (err, req) => {
            if (err) throw err;
            if (!req[0]) return;
            const months = req[0].months;
            const add = parseInt(months) + parseInt(MONTHS);
            sql = `UPDATE servers SET months = "${add}" WHERE guild = "${guildID}"`;
            db.query(sql, (err) => {
                if (err) throw err;
            });

        });
    }
};