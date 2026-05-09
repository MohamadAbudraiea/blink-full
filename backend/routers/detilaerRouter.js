const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const detailerController = require("../controllers/detailerController.js");
const ratingController = require("../controllers/ratingController");
// get tickets
router.get("/tickets/filters", ticketController.getTicketsForStaff);
// router.get("/tickets/pending", ticketController.getPendingTickets);
// router.get("/tickets/finished", ticketController.getFinishedTickets);
router.post("/ticket/finish/:ticket_id", ticketController.finishTicket);

//get rating
router.get("/ticket/rating/:ticket_id", ratingController.getTicketRating);
module.exports = router;
