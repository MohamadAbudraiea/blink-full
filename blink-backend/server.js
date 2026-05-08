const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "./config.env") });
//----------------------

// sql connection
const SQL_DRIVER = require("./Drivers/SQL_Driver");

//----------------------
const app = require("./app");
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`app started in port ${port}`);
});

// When Shutting Down The Server
process.on("SIGINT", async () => {
  SQL_DRIVER.close();
  console.log("🔌 SQL DB connection closed.");
  process.exit(0);
});
