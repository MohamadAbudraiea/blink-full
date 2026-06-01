require("dotenv").config({ path: "./.env" });
const SQL_DRIVER = require("./Drivers/SQL_Driver");
const initModels = require("./models/init-models");

initModels(SQL_DRIVER);

console.log("Applying database migrations manually for subscriptions...");

async function runMigrations() {
  try {
    console.log("1. Creating subscription table...");
    await SQL_DRIVER.query(`
      CREATE TABLE IF NOT EXISTS "subscription" (
        "id" BIGSERIAL PRIMARY KEY,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "user_id" UUID REFERENCES "user" ("id") ON DELETE SET NULL,
        "customer_name" TEXT,
        "customer_phone" TEXT,
        "plan_type" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'requested',
        "total_price" DECIMAL,
        "secretary_id" UUID REFERENCES "user" ("id") ON DELETE SET NULL
      );
    `);

    console.log("2. Adding subscription_id column to ticket table...");
    await SQL_DRIVER.query(
      `ALTER TABLE "ticket" ADD COLUMN IF NOT EXISTS "subscription_id" BIGINT REFERENCES "subscription" ("id") ON DELETE CASCADE;`,
    );

    console.log(
      "✅ Database synced successfully! Subscriptions table created.",
    );
    process.exit(0);
  } catch (err) {
    console.error("❌ Error syncing database:", err);
    process.exit(1);
  }
}

runMigrations();
