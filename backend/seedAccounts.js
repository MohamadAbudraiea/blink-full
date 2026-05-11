const SQL = require("./Drivers/SQL_Driver");
const initModels = require("./models/init-models");
const models = initModels(SQL);
const { account } = models;

async function seedAccounts() {
  try {
    // Create the "Tickets" default account if it doesn't exist
    const [ticketsAccount, created] = await account.findOrCreate({
      where: { name: "Tickets" },
      defaults: {
        name: "Tickets",
        description: "Auto-generated income from finished tickets",
        is_default: true,
      },
    });

    if (created) {
      console.log('✅ Default "Tickets" account created.');
    } else {
      console.log('ℹ️  Default "Tickets" account already exists.');
    }
  } catch (error) {
    console.error("❌ Error seeding accounts:", error.message);
  }
}

module.exports = seedAccounts;
