const SQL = require("../Drivers/SQL_Driver");
const initModels = require("../models/init-models");
const models = initModels(SQL);
const { user, ticket } = models;
const bcrypt = require("bcrypt");

exports.getAllSecretaries = async (req, res) => {
  try {
    const detailers = await user.findAll(
      { where: { type: "secretary" } },
      { attributes: ["id", "name", "email", "phone"] }
    );
    res.status(200).json({
      status: "success",
      data: detailers,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "sth went wrong",
    });
  }
};
