const express = require("express");
const router = express.Router();
const sharedController = require("../controllers/sharedController");
const authController = require("../controllers/authController");
const authUser = require("../middlewares/authentication");
const authenticateUser = require("../middlewares/authentication");
//--------------------------------------------
router.post("/login", authController.userLogin);
router.post("/signup", authController.userSignup);
router.post("/logout", authController.logout);
//--------------------------------------------
router.get("/check", authenticateUser, authController.check);

//--------------------------------------------
router.patch(
  "/change/password",
  authenticateUser,
  sharedController.changePassword
);
router.patch(
  "/change/profile",
  authenticateUser,
  sharedController.updateProfile
);
module.exports = router;
