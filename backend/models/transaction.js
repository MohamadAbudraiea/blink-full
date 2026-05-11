const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "transaction",
    {
      id: {
        autoIncrement: true,
        autoIncrementIdentity: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      account_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "account",
          key: "id",
        },
      },
      type: {
        type: DataTypes.ENUM("in", "out"),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ticket_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: "ticket",
          key: "id",
        },
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.fn("now"),
      },
    },
    {
      sequelize,
      tableName: "transaction",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "transaction_pkey",
          unique: true,
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
