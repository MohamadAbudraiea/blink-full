const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//------------------------------------------
const SQL = require("../Drivers/SQL_Driver");
const initModels = require("../models/init-models");
const models = initModels(SQL);
const { user } = models;
//------------------------------------------
const sendEmail = require("../Drivers/mailer");
exports.userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({
        status: "failed",
        message: "please enter full data",
      });
    // check if the email format is correct
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid email format",
      });
    }
    const findUser = await user.findOne({
      where: { email: email.trim().toLowerCase() },
    });
    if (findUser) {
      const validPassword = await bcrypt.compare(password, findUser.password);
      if (!validPassword) {
        return res.status(400).json({
          status: "fail",
          message: "wrong email or password",
        });
      }
      // sign jwt
      const token = jwt.sign(
        {
          id: findUser.id,
          role: findUser.type,
          email: findUser.email,
          phone: findUser.phone,
          name: findUser.name,
          created_at: findUser.created_at,
        },
        process.env.JWT_SECRET,
      );
      res.cookie("token", token, {
        maxAge: 1000 * 60 * 60 * 2,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      //user data
      req.user = {
        id: findUser.id,
        email: findUser.email,
        phone: findUser.phone,
      };

      //response
      const userData = findUser.toJSON();
      delete userData.password; // to send the response without password:)
      res.status(200).json({
        status: "success",
        data: userData,
        message: "logged in successfully",
      });
    } else {
      return res.status(400).json({
        status: "fail",
        message: "wrong email or password",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};
exports.userSignup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        status: "failed",
        message: "please enter the full data",
      });
    }

    // check if the email format is correct
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid email format",
      });
    }
    //--------------------------------------
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await user.create({
      name: name,
      email: email,
      phone: phone,
      password: hashedPassword,
      type: "user",
    });

    res.status(201).json({
      status: "success",
      data: newUser,
      message: "signed up successfully",
    });
    await sendEmail(
      newUser.email,
      `Welcome ${newUser.name}`,
      `<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 40px 0; background-color: #0a0a0a; color: #e5e5e5;">
     <div style="max-width: 600px; margin: 0 auto; background-color: #111; border: 1px solid #1f1f1f; border-radius: 12px; overflow: hidden;">

    <!-- Header / Logo -->
    <div style="background: linear-gradient(90deg, #3B82F6, #2563EB); padding: 24px; text-align: center;">
      <div style="font-size: 28px; font-weight: bold; letter-spacing: 2px; color: #0a0a0a;">BLINK</div>
    </div>

    <!-- Body -->
    <div style="padding: 36px;">
      <h1 style="font-size: 24px; margin-bottom: 16px; color: #fff;">Welcome to BLINK, ${
        newUser.name
      }!</h1>
      <p style="margin-bottom: 20px; color: #d4d4d4; line-height: 1.6;">
        Thanks for joining the BLINK family 🚗✨. We're excited to keep your car looking sharp and spotless.
      </p>

      <p style="margin-bottom: 12px; font-weight: 600; color: #fff;">With your account, you can:</p>
      <ul style="padding-left: 20px; margin-bottom: 28px; color: #a3a3a3; line-height: 1.6;">
        <li>📅 Book car wash and detailing services easily</li>
        <li>📊 Track your service history</li>
        <li>⚡ Manage appointments online</li>
      </ul>

      <div style="border-top: 1px solid #1f1f1f; margin: 32px 0;"></div>

      <p style="margin-bottom: 20px; color: #d4d4d4;">Ready to shine?</p>
      <p style="text-align: center; margin-bottom: 32px;">
        <a href="${process.env.FRONTEND_URL}/booking"
           style="display: inline-block; padding: 14px 28px; background-color: #3B82F6; color: #0a0a0a; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
          🚀 Book Your First Service
        </a>
      </p>

      <div style="border-top: 1px solid #1f1f1f; margin: 32px 0;"></div>

      <p style="color: #a3a3a3; line-height: 1.6;">
        Have questions? Contact us anytime at 
        <a href="mailto:support@blink.com" style="color: #3B82F6; text-decoration: none;">support@blink.com</a> 
        or visit our 
        <a href="${
          process.env.FRONTEND_URL
        }/contact" style="color: #3B82F6; text-decoration: none;">contact page</a>.
      </p>

      <p style="margin-top: 24px; color: #d4d4d4;">Cheers,<br>The BLINK Team</p>
    </div>

    <!-- Footer -->
    <div style="background-color: #0d0d0d; padding: 20px; text-align: center; font-size: 12px; color: #737373;">
      <p>© ${new Date().getFullYear()} BLINK. All rights reserved.</p>
      <p>You’re receiving this email because you created an account with BLINK.</p>
    </div>
  </div>
</body>

`,
    );
  } catch (error) {
    res.status(400).json({
      error: error,
    });
  }
};
// User logout
exports.logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return res.json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    res.send(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

exports.check = async (req, res) => {
  try {
    const userData = await user.findOne({
      where: { id: req.user.id },
      attributes: ["id", "name", "email", "phone", "type", "created_at"],
    });

    if (!userData) {
      return res
        .status(404)
        .json({ status: "failed", message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      data: userData,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
