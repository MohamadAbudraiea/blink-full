const SQL = require("../Drivers/SQL_Driver");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
const initModels = require("../models/init-models");
const models = initModels(SQL);
const { user, ticket } = models;
const bcrypt = require("bcrypt");

// Helper function to format tickets for frontend
const formatSchedule = (tickets) =>
  tickets.map((t) => ({
    ticket_id: t.id,
    date: t.date,
    start: t.date + "T" + t.start_time, // ISO format for frontend
    end: t.date + "T" + t.end_time,
    interval: `${t.start_time} - ${t.end_time}`,
  }));

// Get all detailers
exports.getAlldetailers = async (req, res) => {
  try {
    const detailers = await user.findAll({
      where: { type: "detailer" },
      attributes: ["id", "name", "email", "phone"], // exclude sensitive fields
    });

    res.status(200).json({
      status: "success",
      data: detailers,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};

// Get all pending tickets for a detailer (all dates)
exports.getDetailerSchedule = async (req, res) => {
  try {
    const { detailer_id } = req.params;

    const detailerTickets = await ticket.findAll({
      where: { detailer_id, status: "pending" },
      attributes: ["id", "date", "start_time", "end_time"],
      order: [
        ["date", "ASC"],
        ["start_time", "ASC"],
      ],
    });

    const schedule = formatSchedule(detailerTickets);

    return res.status(200).json({
      status: "success",
      detailer_id,
      schedule,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
};

// Get pending tickets for a detailer on a specific date
exports.getDetailerScheduleByDate = async (req, res) => {
  try {
    const { detailer_id, date } = req.params;

    const detailerTickets = await ticket.findAll({
      where: { detailer_id, date, status: "pending" },
      attributes: ["id", "date", "start_time", "end_time"],
      order: [["start_time", "ASC"]], // date ordering not needed
    });

    const schedule = formatSchedule(detailerTickets);

    return res.status(200).json({
      status: "success",
      detailer_id,
      schedule,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.getDetailerStock = async (req, res) => {
  try {
    const { detailer_id } = req.params;
    const { date, startDate, endDate } = req.query;

    // Validate detailer_id
    if (!detailer_id) {
      return res.status(400).json({
        success: false,
        message: "Detailer ID is required",
      });
    }

    // Validate date parameters
    if (!date && (!startDate || !endDate)) {
      return res.status(400).json({
        success: false,
        message:
          "Either single date or date range (startDate and endDate) is required",
      });
    }

    let whereCondition = {
      detailer_id: detailer_id,
      payment_method: "cash",
      status: "finished",
    };

    // Build date condition based on input
    if (date) {
      // Single date
      whereCondition.date = date;
    } else {
      // Date range - use Op from sequelize
      whereCondition.date = {
        [Op.between]: [startDate, endDate],
      };
    }

    // Calculate total cash amount for the tickets
    const summaryResult = await ticket.findAll({
      where: whereCondition,
      attributes: [
        [SQL.fn("SUM", SQL.col("price")), "totalCashAmount"],
        [SQL.fn("COUNT", SQL.col("id")), "totalTickets"],
      ],
      raw: true,
    });

    // Get all ticket details
    const ticketsData = await ticket.findAll({
      where: whereCondition,
      attributes: [
        "id",
        "date",
        "start_time",
        "end_time",
        "price",
        "service",
        "typeOfService",
        "payment_method",
        "status",
        "location",
        "note",
        "created_at",
      ],
      order: [
        ["date", "ASC"],
        ["start_time", "ASC"],
      ],
      raw: true,
    });

    const totalAmount = parseFloat(summaryResult[0]?.totalCashAmount) || 0;
    const totalTickets = parseInt(summaryResult[0]?.totalTickets) || 0;

    return res.status(200).json({
      success: true,
      data: {
        detailer_id,
        dateRange: date ? { singleDate: date } : { startDate, endDate },
        totalCashAmount: totalAmount,
        totalTickets: totalTickets,
        tickets: ticketsData, // Include all ticket details in response
      },
    });
  } catch (error) {
    console.error("Error fetching detailer stock:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
