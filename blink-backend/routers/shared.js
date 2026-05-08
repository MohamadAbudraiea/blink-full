const express = require("express");
const router = express.Router();
const otpController = require("../controllers/otpController");
const ratingController = require("../controllers/ratingController");
const sharedController = require("../controllers/sharedController");
//--------------------------------------------------------------
router.post("/otp", otpController.sendOTP);
router.post("/otp/changepassword", otpController.changePassword);

//--------------------------------------------------------------
router.get("/ticket/all/ratings", ratingController.getRatingsWithTickets);
//--------------------------------------------------------------
router.post("/sendmessage", sharedController.sendMessage);
module.exports = router;
