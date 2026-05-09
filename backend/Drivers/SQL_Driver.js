// SQL Connection
const { Sequelize } = require("sequelize");
SQLConn = new Sequelize(process.env.DB_URL, {
  logging: false,
});

SQLConn.authenticate()
  .then(() => {
    console.log("Connected to SQL ");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = SQLConn;
