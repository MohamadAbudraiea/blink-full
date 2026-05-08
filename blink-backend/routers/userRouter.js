const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const ratingController = require("../controllers/ratingController");
router.post("/ticket", ticketController.addticket);
// in the front make  a confirmation message , and the ticket
// can be canceled if and only if the ticket is still requested
router.post("/ticket/cancel/:ticket_id", ticketController.cancelticket);
//----------------------------------------------------------------------
// rating
router.get("/ticket/rating/:ticket_id", ratingController.getTicketRating);
router.post("/ticket/rating", ratingController.rateticket);
//----------------------------------------------------------------------
router.get("/ticket/filters", ticketController.getUserTickets);

module.exports = router;
