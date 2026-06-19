const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const ratingController = require("../controllers/ratingController");
const subscriptionController = require("../controllers/subscriptionController");
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
// location history (most-used locations from past tickets)
router.get("/ticket/locations", ticketController.getUserLocations);

// subscriptions
router.post("/subscription", subscriptionController.createSubscription);
router.get("/subscription", subscriptionController.getSubscriptions);
router.post("/subscription/resubscribe/:id/preview", subscriptionController.previewResubscription);
router.post("/subscription/resubscribe/:id/confirm", subscriptionController.confirmResubscription);

module.exports = router;
