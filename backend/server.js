const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "./.env") });
//----------------------

// sql connection
const SQL_DRIVER = require("./Drivers/SQL_Driver");

//----------------------
const app = require("./app");
const seedAccounts = require("./seedAccounts");
const port = process.env.PORT;

// Sync new tables then seed, then start server
SQL_DRIVER.sync({ alter: false })
  .then(async () => {
    await seedAccounts();
    app.listen(port, () => {
      console.log(`app started in port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });

// When Shutting Down The Server
process.on("SIGINT", async () => {
  SQL_DRIVER.close();
  console.log("🔌 SQL DB connection closed.");
  process.exit(0);
});
