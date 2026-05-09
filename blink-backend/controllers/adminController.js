const SQL = require("../Drivers/SQL_Driver");
const initModels = require("../models/init-models");
const models = initModels(SQL);
const { user, ticket } = models;
const bcrypt = require("bcrypt");
// to make or in sequelize
const { Op } = require("sequelize");

exports.getUsers = async (req, res) => {
  try {
    const Users = await user.findAll({
      where: {
        [Op.or]: [{ type: "secretary" }, { type: "detailer" }],
      },
      attributes: {
        exclude: ["password"],
      },
    });

    const secretaries = Users.filter((user) => user.type === "secretary");
    const detailers = Users.filter((user) => user.type === "detailer");

    res.status(200).json({
      status: "success",
      data: {
        secretaries: secretaries,
        detailers: detailers,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "sth went wrong",
    });
  }
};
exports.addUser = async (req, res) => {
  try {
    //type mSust be detailer or secretary
    const { name, email, phone, password, type } = req.body;
    if (type === "admin" || type === "user") {
      return res.status(400).json({
        message: "your'e not allowed to add this type",
      });
    }
    hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await user.create({
      name: name,
      email: email,
      phone: phone,
      password: hashedPassword,
      type: type,
    });
    const newUserData = newUser.toJSON();
    delete newUserData.password; // to send the response without password:)
    res.status(201).json({
      status: "sucsess",
      data: newUserData,
      message: `${newUserData.name} added as ${newUserData.type} successfully`,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.body;

    const deletedUser = await user.destroy({
      where: { id: id },
    });

    console.log(deletedUser);

    res.status(202).json({
      status: "success",
      message: "user deleted",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "sth went wrong",
    });
  }
};
exports.editUser = async (req, res) => {
  try {
    const { id, name, email, phone } = req.body;

    if (!id || !name || !email || !phone)
      return res.status(400).json({
        status: "failed",
        message: "please enter the full data",
      });

    // check if the email format is correct
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid email format",
      });
    }

    // check if the phone format is correct
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid phone format, must be 10 digits",
      });
    }

    // check if the name format is correct
    const nameRegex = /^[a-zA-Z\s]{3,30}$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid name format, must be between 3 and 30 characters",
      });
    }

    // check if the user exists
    const existingUser = await user.findOne({
      where: { id: id },
    });
    if (!existingUser)
      return res.status(404).json({
        status: "failed",
        message: "user not found",
      });

    // update the user
    await existingUser.update(
      {
        name: name,
        email: email,
        phone: phone,
      },
      {
        where: { id: id },
      },
    );

    res.status(202).json({
      status: "success",
      message: "user edited successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.status(200).json({ status: "success", data: [] });
    }

    const results = await user.findAll({
      where: {
        type: "user",
        [Op.or]: [
          { name: { [Op.iLike]: `%${q}%` } },
          { phone: { [Op.iLike]: `%${q}%` } },
          { email: { [Op.iLike]: `%${q}%` } },
        ],
      },
      attributes: ["id", "name", "phone", "email"],
      limit: 10,
    });

    return res.status(200).json({ status: "success", data: results });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};
