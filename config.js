const dbApp = require("knex")({
  client: "mysql2",
  connection: {
    // host: "localhost",
    // port: 3306,
    // user: "root",
    // password: "ntng",
    // database: "surasing",
    host: "127.0.0.1",
    port: 3306,
    user: "devoarm",
    password: "Ntng@arm55",
    database: "surasing_heal",
  },
  pool: {
    min: 0,
    max: 10,
    afterCreate: (conn, done) => {
      conn.query("SET NAMES utf8mb4", (err) => {
        done(err, conn);
      });
    },
  },
});

module.exports = { dbApp };
