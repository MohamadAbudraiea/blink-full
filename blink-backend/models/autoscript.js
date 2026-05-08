const SequelizeAuto = require("sequelize-auto");

const auto = new SequelizeAuto(
  "postgres",
  "postgres.cpwurcwfjuqtfvjwlhcx",
  "rex12345",
  {
    host: "aws-1-eu-north-1.pooler.supabase.com",
    dialect: "postgres",
    port: 5432,
    directory: "./",
    additional: { timestamps: false },
    schema: "public",
  }
);

auto.run().then((data) => {
  console.log("Generated models for:", Object.keys(data.tables));
});
