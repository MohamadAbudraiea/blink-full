const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "account",
    {
      id: {
        autoIncrement: true,
        autoIncrementIdentity: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: "account_name_key",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.fn("now"),
      },
    },
    {
      sequelize,
      tableName: "account",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "account_pkey",
          unique: true,
          fields: [{ name: "id" }],
        },
        {
          name: "account_name_key",
          unique: true,
          fields: [{ name: "name" }],
        },
      ],
    }
  );
};
