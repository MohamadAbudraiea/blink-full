const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "./.env") });

const SQL = require("./Drivers/SQL_Driver");
const initModels = require("./models/init-models");
initModels(SQL);

SQL.sync()
  .then(() => {
    console.log("Tables synced successfully");
    const seedAccounts = require("./seedAccounts");
    return seedAccounts();
  })
  .then(() => {
    console.log("All done!");
    process.exit(0);
  })
  .catch((e) => {
    console.error("Error:", e.message);
    process.exit(1);
  });
// hello
