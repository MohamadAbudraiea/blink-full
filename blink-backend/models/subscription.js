const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "subscription",
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
        allowNull: true,
        references: {
          model: "user",
          key: "id",
        },
      },
      customer_name: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      customer_phone: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      plan_type: {
        type: DataTypes.ENUM("2", "4", "8"),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("requested", "pending", "finished", "canceled"),
        allowNull: false,
        defaultValue: "requested",
      },
      total_price: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      secretary_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "user",
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "subscription",
      schema: "public",
      timestamps: false,
      indexes: [
        {
          name: "subscription_pkey",
          unique: true,
          fields: [{ name: "id" }],
        },
      ],
      hooks: {
        afterFind: (results) => {
          if (!results) return;
          const instances = Array.isArray(results) ? results : [results];
          for (const instance of instances) {
            if (instance.dataValues && instance.dataValues.user === null && instance.dataValues.customer_name) {
              instance.dataValues.user = {
                name: instance.dataValues.customer_name,
                phone: instance.dataValues.customer_phone
              };
            }
          }
        }
      }
    }
  );
};
