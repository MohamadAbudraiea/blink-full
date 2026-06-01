require("dotenv").config({ path: "./.env" });
const SQL_DRIVER = require("./Drivers/SQL_Driver");
const initModels = require("./models/init-models");

// Initialize models so Sequelize knows about them
initModels(SQL_DRIVER);

console.log(
  "Applying database migrations manually to avoid ENUM casting errors...",
);

async function runMigrations() {
  try {
    console.log("1. Altering ticket table to make user_id nullable...");
    await SQL_DRIVER.query(
      `ALTER TABLE "ticket" ALTER COLUMN "user_id" DROP NOT NULL;`,
    );

    console.log("2. Adding customer_name column to ticket table...");
    // Use IF NOT EXISTS equivalent or just catch the error if it exists
    await SQL_DRIVER.query(
      `ALTER TABLE "ticket" ADD COLUMN IF NOT EXISTS "customer_name" TEXT;`,
    );

    console.log("3. Adding customer_phone column to ticket table...");
    await SQL_DRIVER.query(
      `ALTER TABLE "ticket" ADD COLUMN IF NOT EXISTS "customer_phone" TEXT;`,
    );

    console.log("✅ Database synced successfully! The new columns were added.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error syncing database:", err);
    process.exit(1);
  }
}

runMigrations();
