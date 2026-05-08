const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "rating",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
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
      ticket_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "ticket",
          key: "id",
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      rating_number: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        default: false,
      },
    },
    {
      sequelize,
      tableName: "rating",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "rating_pkey",
          unique: true,
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
