const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const ticketController = require("../controllers/ticketController");
const detailerController = require("../controllers/detailerController");
const ratingController = require("../controllers/ratingController");
const subscriptionController = require("../controllers/subscriptionController");
const financeController = require("../controllers/financeController");
const pricingController = require("../controllers/pricingController");
// to get all the secretaries and detailers
router.get("/user", adminController.getUsers);
// the user can be secretary or detailer just
router.post("/user", adminController.addUser);
// to delete users(shouldn't validate)
router.delete("/user", adminController.deleteUser);
// to edit users(shouldn't validate)
router.put("/user", adminController.editUser);
// search users (for ticket creation)
router.get("/user/search", adminController.searchUsers);
router.get("/detailer/schedules/all", detailerController.getAllDetailersSchedules);
router.get("/detailer/:detailer_id", detailerController.getDetailerSchedule);
router.get(
  "/detailer/:detailer_id/:date",
  detailerController.getDetailerScheduleByDate
);
router.get(
  "/detailer/:detailer_id/stock/dates",
  detailerController.getDetailerStock
);

//-------------------------------------------------
//tickets get
router.get("/ticket/charts", ticketController.getBookingsForCharts);
router.get(
  "/ticket/charts/canceled",
  ticketController.getCanceledTicketsForCharts
);

router.get("/ticket/filters", ticketController.getFilteredTickets);
router.get("/ticket/:ticket_id", ticketController.getTicketByID);
router.get("/ticket/type/requested", ticketController.getRequestedTickets);
router.get("/ticket/type/pending", ticketController.getPendingTickets);
router.get("/ticket/type/finished", ticketController.getFinishedTickets);
router.get("/ticket/type/canceled", ticketController.getCanceldTickets);
// tickets functionalites
router.post("/ticket/pending", ticketController.addPendingTicket);
router.post("/ticket/accept/:ticket_id", ticketController.acceptTicket);
router.post("/ticket/cancel/:ticket_id", ticketController.cancelticket);
router.post("/ticket/finish/:ticket_id", ticketController.finishTicket);

//get rating
router.get("/ticket/rating/:ticket_id", ratingController.getTicketRating);
//publish rating
router.post("/ticket/rating/toggle", ratingController.togglePublishTicket);
// accept or cancel ticket
router.post("/ticket/accept/:ticket_id", ticketController.acceptTicket);
router.post("/ticket/cancel/:ticket_id", ticketController.cancelticket);

// subscriptions
router.post("/subscription", subscriptionController.createSubscription);
router.get("/subscription", subscriptionController.getSubscriptions);
router.post("/subscription/cancel/:id", subscriptionController.cancelSubscription);
router.post("/subscription/resubscribe/:id/preview", subscriptionController.previewResubscription);
router.post("/subscription/resubscribe/:id/confirm", subscriptionController.confirmResubscription);

// pricing
router.get("/pricing", pricingController.getPricing);
router.put("/pricing", pricingController.updatePricing);

// ============ FINANCE ============
// Accounts
router.get("/finance/account", financeController.getAccounts);
router.post("/finance/account", financeController.createAccount);
router.delete("/finance/account/:id", financeController.deleteAccount);
// Transactions
router.post("/finance/transaction", financeController.createTransaction);
router.delete("/finance/transaction/:id", financeController.deleteTransaction);
router.get("/finance/account/:id/transactions", financeController.getAccountTransactions);
// Reports
router.get("/finance/reports", financeController.getFinanceReports);
router.get("/finance/account/:id/report", financeController.getAccountReport);

module.exports = router;
