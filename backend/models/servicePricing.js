const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "service_pricing",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      service: {
        type: DataTypes.ENUM(
          "wash",
          "dryclean",
          "polish",
          "graphene",
          "nanoceramic"
        ),
        allowNull: false,
        unique: true,
      },
      base_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      plan_2_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      plan_4_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      plan_8_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: "service_pricing",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "service_pricing_pkey",
          unique: true,
          fields: [{ name: "id" }],
        },
        {
          name: "service_pricing_service_unique",
          unique: true,
          fields: [{ name: "service" }],
        },
      ],
    }
  );
};
