const SQL = require("../Drivers/SQL_Driver");
const initModels = require("../models/init-models");
const models = initModels(SQL);
const { user } = models;
const bcrypt = require("bcrypt");
const sendEmail = require("../Drivers/mailer");

exports.changePassword = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { oldPassword, newPassword } = req.body;

    const existUser = await user.findOne({ where: { id: user_id } });
    if (!existUser) {
      return res.status(400).json({
        status: "failed",
        message: "user not found",
      });
    }
    const validPassword = await bcrypt.compare(oldPassword, existUser.password);
    if (!validPassword) {
      return res.status(400).json({
        status: "failed",
        message: "wrong password",
      });
    }
    // hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // update user
    await user.update(
      { password: hashedNewPassword },
      { where: { id: user_id } }
    );

    return res.status(200).json({
      status: "success",
      message: "password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "sth went wrong",
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    if (!name || !phone || !email) {
      return res.status(400).json({
        status: "failed",
        message: "please enter all the data",
      });
    }
    const user_id = req.user.id;

    await user.update({ name, phone, email }, { where: { id: user_id } });

    res.status(204).json({
      status: "success",
      message: "User Profile Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
exports.sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    await sendEmail(
      "technical@blink-cars.com",
      subject,
      `
      Message From ${name}.
      ${message}
      contact:
      <a href="mailto:${email}">${email} </a>
      `
    );
    res.status(200).json({
      status: "success",
      message: "Email sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "sth went wrong",
    });
  }
};
