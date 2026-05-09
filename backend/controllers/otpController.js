const SQL = require("../Drivers/SQL_Driver");
const initModels = require("../models/init-models");
const models = initModels(SQL);
const { user, OTP } = models;
const bcrypt = require("bcrypt");
const sendEmail = require("../Drivers/mailer");
//----------------------------------------
function generateOTP() {
  const length = 6;
  const characters = "1234567890";
  let otp = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters[randomIndex];
  }
  return otp;
}
function otpEmailTemplate(userName, otpCode) {
  return `
  <body style="font-family: 'Segoe UI', Tahoma, sans-serif; margin:0; padding:40px 0; background-color:#0a0a0a; color:#e5e5e5;">
    <div style="max-width:600px; margin:0 auto; background-color:#111; border:1px solid #1f1f1f; border-radius:12px; overflow:hidden;">
      
      <!-- Header -->
      <div style="background:linear-gradient(90deg,#3B82F6,#2563EB); padding:24px; text-align:center;">
        <div style="font-size:28px; font-weight:bold; letter-spacing:2px; color:#0a0a0a;">BLINK</div>
      </div>
      
      <!-- Body -->
      <div style="padding:36px; text-align:center;">
        <h1 style="font-size:22px; margin-bottom:16px; color:#fff;">Verify Your Account</h1>
        <p style="margin-bottom:24px; color:#d4d4d4; line-height:1.6;">
          Hi ${
            userName || "there"
          }, use the code below to verify your email with BLINK.
        </p>
        <div style="display:inline-block; background-color:#1a1a1a; padding:16px 32px; border-radius:8px; font-size:32px; font-weight:bold; letter-spacing:4px; color:#3B82F6;">
          ${otpCode}
        </div>
        <p style="margin-top:24px; color:#a3a3a3; font-size:14px;">
          This code will expire in <strong>60 seconds</strong>.
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color:#0d0d0d; padding:20px; text-align:center; font-size:12px; color:#737373;">
        <p>© ${new Date().getFullYear()} BLINK. All rights reserved.</p>
      </div>
    </div>
  </body>
  `;
}

function passwordChangedTemplate(userName) {
  return `
  <body style="font-family: 'Segoe UI', Tahoma, sans-serif; margin:0; padding:40px 0; background-color:#0a0a0a; color:#e5e5e5;">
    <div style="max-width:600px; margin:0 auto; background-color:#111; border:1px solid #1f1f1f; border-radius:12px; overflow:hidden;">
      
      <!-- Header -->
      <div style="background:linear-gradient(90deg,#3B82F6,#2563EB); padding:24px; text-align:center;">
        <div style="font-size:28px; font-weight:bold; letter-spacing:2px; color:#0a0a0a;">BLINK</div>
      </div>
      
      <!-- Body -->
      <div style="padding:36px; text-align:center;">
        <h1 style="font-size:22px; margin-bottom:16px; color:#fff;">Password Changed Successfully</h1>
        <p style="margin-bottom:24px; color:#d4d4d4; line-height:1.6;">
          Hi ${
            userName || "there"
          }, your password has been updated successfully.  
        </p>
        <p style="margin-bottom:24px; color:#a3a3a3; font-size:14px;">
          If this wasn’t you, please <a href="${
            process.env.FRONTEND_URL
          }/contact" style="color:#3B82F6; text-decoration:none;">contact support immediately</a>.
        </p>
        <p style="color:#d4d4d4;">Stay safe,<br>The BLINK Team</p>
      </div>

      <!-- Footer -->
      <div style="background-color:#0d0d0d; padding:20px; text-align:center; font-size:12px; color:#737373;">
        <p>© ${new Date().getFullYear()} BLINK. All rights reserved.</p>
      </div>
    </div>
  </body>
  `;
}

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const existUser = await user.findOne({
      where: { email: email },
    });

    if (!existUser) {
      return res.status(404).json({
        status: "failed",
        message: "user not found",
      });
    }
    const otpContent = generateOTP();
    await sendEmail(
      email,
      "BLINK Verification Code",
      otpEmailTemplate(existUser.name, otpContent)
    );
    const otpRecord = await OTP.create({
      code: otpContent,
      user_id: existUser.id,
      email: email,
    });

    // delete otp
    setTimeout(async () => {
      try {
        await OTP.destroy({ where: { id: otpRecord.id } });
        console.log(`OTP for ${email} deleted after 60 seconds`);
      } catch (error) {
        console.log(error.message);
      }
    }, 60 * 1000);
    return res.status(201).json({
      status: "success",
      message: `OTP sent to ${existUser.email}`,
    });
  } catch (error) {
    console.log("error in otp function:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message || "sth went wrong",
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { email, newPassword, otpCode } = req.body;
    const foundedOTP = await OTP.findOne({ where: { email: email } });
    if (!foundedOTP) {
      return res.status(404).json({
        status: "failed",
        message: "Your Code have been expired",
      });
    }
    if (foundedOTP.code == otpCode) {
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      const existUser = await user.update(
        { password: hashedNewPassword },
        { where: { email: email } }
      );
      await sendEmail(
        email,
        "Your BLINK Password Was Changed",
        passwordChangedTemplate(existUser.name)
      );

      return res.status(201).json({
        status: "success",
        message: "Password have been changed",
      });
    } else {
      return res.status(404).json({
        status: "failed",
        message: "OTP is not matched",
      });
    }
  } catch (error) {
    console.log("error:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message || "sth went wrong",
    });
  }
};
