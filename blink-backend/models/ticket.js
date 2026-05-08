const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "ticket",
    {
      id: {
        autoIncrement: true,
        autoIncrementIdentity: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.fn("now"),
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      service: {
        type: DataTypes.ENUM(
          "wash",
          "dryclean",
          "polish",
          "gravin",
          "nanoceramic"
        ),
        allowNull: false,
      },
      typeOfService: {
        type: DataTypes.ENUM("Blink", "Elite", "Premium"),
        allowNull: true,
      },
      payment_method: {
        type: DataTypes.ENUM("cash", "online"),
        allowNull: true,
        default: "cash",
      },
      status: {
        type: DataTypes.ENUM("requested", "pending", "finished", "canceled"),
        allowNull: false,
        defaultValue: "requested",
      },
      location: {
        type: DataTypes.TEXT,
        allowNull: true,
        default: "blink",
      },
      secretary_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "user",
          key: "id",
        },
      },
      detailer_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "user",
          key: "id",
        },
      },
      cancel_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "ticket",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "ticket_pkey",
          unique: true,
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
