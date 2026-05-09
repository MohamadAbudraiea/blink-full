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
      subscription_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: "subscription",
          key: "id",
        },
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
