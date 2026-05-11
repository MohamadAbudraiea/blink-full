const { Op, Sequelize } = require("sequelize");
const SQL = require("../Drivers/SQL_Driver");
const initModels = require("../models/init-models");
const models = initModels(SQL);
const { user, ticket, rating, account, transaction } = models;
const bcrypt = require("bcrypt");

exports.addticket = async (req, res) => {
  try {
    const {
      date,
      start_time,
      end_time,
      service,
      location,
      note,
      typeOfService,
    } = req.body || {};
    const user_id = req.user.id;
    const status = "requested";

    // build ticket data dynamically
    const ticketData = {
      user_id,
      date,
      service,
      location,
      status,
      typeOfService,
      start_time,
      end_time,
      ...(note ? { note } : {}), // only add note if it exists
    };

    const newTicket = await ticket.create(ticketData);

    return res.status(201).json({
      status: "success",
      data: newTicket,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "failed",
      message:
        error.message || "Something went wrong while creating the ticket",
    });
  }
};
exports.addPendingTicket = async (req, res) => {
  try {
    const {
      isAnonymous,
      user_id,
      customer_name,
      customer_phone,
      detailer_id,
      date,
      start_time,
      end_time,
      location,
      service,
      typeOfService,
      note,
      price,
      subscription_id,
    } = req.body || {};

    // Validate required fields
    if (!detailer_id) {
      return res
        .status(400)
        .json({ status: "failed", message: "Detailer is required" });
    }
    if (!date || !start_time || !end_time) {
      return res.status(400).json({
        status: "failed",
        message: "Date, start time, and end time are required",
      });
    }

    // Check if detailer is free at this time
    const free = await isDetailerFree(detailer_id, date, start_time, end_time);
    if (!free) {
      return res.status(400).json({
        status: "failed",
        message: "Detailer is busy at this time",
      });
    }

    const status = "pending";
    const secretary_id = req.user.id;

    // build ticket data dynamically
    const ticketData = {
      date,
      start_time,
      end_time,
      service,
      location,
      status,
      typeOfService,
      secretary_id: secretary_id || null,
      detailer_id: detailer_id || null,
      ...(note ? { note } : {}),
      ...(price ? { price } : {}),
      ...(subscription_id ? { subscription_id } : {}),
    };

    if (subscription_id) {
      if (user_id) ticketData.user_id = user_id;
      if (customer_name) ticketData.customer_name = customer_name;
      if (customer_phone) ticketData.customer_phone = customer_phone;
    } else if (isAnonymous) {
      if (!customer_name || !customer_phone) {
        return res
          .status(400)
          .json({
            status: "failed",
            message:
              "Customer name and phone are required for anonymous tickets",
          });
      }
      ticketData.customer_name = customer_name;
      ticketData.customer_phone = customer_phone;
    } else {
      if (!user_id) {
        return res
          .status(400)
          .json({
            status: "failed",
            message: "User ID is required for non-anonymous tickets",
          });
      }
      ticketData.user_id = user_id;
    }

    const newTicket = await ticket.create(ticketData);

    return res.status(201).json({
      status: "success",
      data: newTicket,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "failed",
      message:
        error.message || "Something went wrong while creating the ticket",
    });
  }
};
exports.getTicketByID = async (req, res) => {
  try {
    const { ticket_id } = req.params;
    const returendTicket = await ticket.findOne({
      where: { id: ticket_id },
      include: [
        { model: user, as: "user", attributes: ["name", "phone"] },
        { model: user, as: "detailer", attributes: ["name"] },
        { model: user, as: "secretary", attributes: ["name"] },
      ],
    });
    res.status(200).json({
      status: "success",
      data: returendTicket,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "sth went wrong",
    });
  }
};
exports.getBookingsForCharts = async (req, res) => {
  try {
    const { month, year } = req.query;

    // Filter by month/year if provided
    const where = {};
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      where.date = { [Op.between]: [startDate, endDate] };
    }

    const tickets = await ticket.findAll({
      where,
      order: [["status", "ASC"]],
      include: [
        { model: user, as: "user", attributes: ["name", "phone"] },
        { model: user, as: "detailer", attributes: ["name"] },
        { model: user, as: "secretary", attributes: ["name"] },
      ],
    });

    // Aggregate by Status
    const statusCount = {};
    // Aggregate by Service
    const serviceCount = {};
    // Aggregate by day
    const dayCount = {};

    tickets.forEach((t) => {
      // Status
      if (t.status) statusCount[t.status] = (statusCount[t.status] || 0) + 1;

      // Service
      if (t.service)
        serviceCount[t.service] = (serviceCount[t.service] || 0) + 1;

      // Day
      if (t.date) {
        const date = new Date(t.date);
        const day = date.getDate();
        dayCount[day] = (dayCount[day] || 0) + 1;
      }
    });

    const statusData = Object.keys(statusCount).map((status) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: statusCount[status],
    }));

    const serviceData = Object.keys(serviceCount).map((service) => ({
      name: service,
      value: serviceCount[service],
    }));

    const daysInMonth = month && year ? new Date(year, month, 0).getDate() : 31;
    const lineData = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return { day, bookings: dayCount[day] || 0 };
    });

    res.status(200).json({
      status: "success",
      data: {
        lineData,
        statusData,
        serviceData,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};
exports.getFilteredTickets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const filter = req.query.filter || "All";
    const filterMonth =
      req.query.filterMonth === "null" ? null : req.query.filterMonth;
    const filterDay =
      req.query.filterDay === "null" ? null : req.query.filterDay;
    const filterYear =
      req.query.filterYear === "null" ? null : req.query.filterYear;
    const ticketId = Number(req.query.ticketId) || null;

    const offset = (page - 1) * limit;

    // Build where clause based on filters
    const whereClause = {};

    if (filter !== "All") {
      whereClause.status = filter;
    }

    if (ticketId) {
      whereClause.id = ticketId;
    }

    // Use current year as default if no year is specified
    const year = filterYear ? parseInt(filterYear) : new Date().getFullYear();

    // Handle date filtering using date ranges (more reliable than Sequelize literals)
    if (filterYear && filterYear !== "null") {
      // Start with year filter as base
      const startDate = new Date(year, 0, 1); // January 1st of the year
      const endDate = new Date(year, 11, 31); // December 31st of the year

      whereClause.date = {
        [Op.between]: [startDate, endDate],
      };

      // If month is also specified, narrow down the range
      if (filterMonth && filterMonth !== "null") {
        const month = parseInt(filterMonth);
        const monthStartDate = new Date(year, month - 1, 1);
        const monthEndDate = new Date(year, month, 0); // Last day of the month

        whereClause.date = {
          [Op.between]: [monthStartDate, monthEndDate],
        };

        // If day is also specified, narrow down further
        if (filterDay && filterDay !== "null") {
          const day = parseInt(filterDay);
          const specificDate = new Date(year, month - 1, day);
          const nextDay = new Date(year, month - 1, day + 1);

          whereClause.date = {
            [Op.gte]: specificDate,
            [Op.lt]: nextDay,
          };
        }
      }
    } else {
      // If no year is specified, but month are specified
      const currentYear = new Date().getFullYear();

      if (filterMonth && filterMonth !== "null") {
        const month = parseInt(filterMonth);
        const monthStartDate = new Date(currentYear, month - 1, 1);
        const monthEndDate = new Date(currentYear, month, 0);

        whereClause.date = {
          [Op.between]: [monthStartDate, monthEndDate],
        };

        if (filterDay && filterDay !== "null") {
          const day = parseInt(filterDay);
          const specificDate = new Date(currentYear, month - 1, day);
          const nextDay = new Date(currentYear, month - 1, day + 1);

          whereClause.date = {
            [Op.gte]: specificDate,
            [Op.lt]: nextDay,
          };
        }
      }
    }

    const { count, rows: tickets } = await ticket.findAndCountAll({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      order: [
        ["status", "ASC"],
        ["date", "DESC"],
      ],
      limit,
      offset,
      include: [
        {
          model: user,
          as: "user",
          attributes: ["name", "phone"],
        },
        {
          model: user,
          as: "detailer",
          attributes: ["name"],
        },
        {
          model: user,
          as: "secretary",
          attributes: ["name"],
        },
      ],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      status: "success",
      data: {
        tickets,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: count,
          itemsPerPage: limit,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};
exports.getCanceledTicketsForCharts = async (req, res) => {
  try {
    const { month, year } = req.query;

    // Filter by month/year if provided
    const where = { status: "canceled" };
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      where.date = { [Op.between]: [startDate, endDate] };
    }

    const tickets = await ticket.findAll({
      where,
      order: [["date", "ASC"]],
      include: [
        { model: user, as: "user", attributes: ["name", "phone"] },
        { model: user, as: "detailer", attributes: ["name"] },
        { model: user, as: "secretary", attributes: ["name"] },
      ],
    });

    // Categories for cancellation
    const cancelCategories = {
      "High Price": 0,
      "Not Suitable Time": 0,
      Other: 0,
    };

    tickets.forEach((t) => {
      const reason = t.cancel_reason?.trim() || "";
      if (reason === "High Price") cancelCategories["High Price"] += 1;
      else if (reason === "Not Suitable Time")
        cancelCategories["Not Suitable Time"] += 1;
      else cancelCategories["Other"] += 1;
    });

    // Prepare data for charts
    const cancelData = Object.keys(cancelCategories).map((key) => ({
      name: key,
      value: cancelCategories[key],
    }));

    res.status(200).json({
      status: "success",
      data: {
        totalCanceled: tickets.length,
        cancelData,
        tickets, // include all canceled tickets data
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};
exports.getUserTickets = async (req, res) => {
  try {
    const user_id = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const filter = req.query.filter || "All";
    const filterMonth =
      req.query.filterMonth === "null" ? null : req.query.filterMonth;
    const filterDay =
      req.query.filterDay === "null" ? null : req.query.filterDay;
    const filterYear =
      req.query.filterYear === "null" ? null : req.query.filterYear;
    const ticketId = Number(req.query.ticketId) || null;

    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = { user_id };

    if (filter !== "All") {
      whereClause.status = filter;
    }

    if (ticketId) {
      whereClause.id = ticketId;
    }

    // Default year
    const year = filterYear ? parseInt(filterYear) : new Date().getFullYear();

    // Date filters
    if (filterYear && filterYear !== "null") {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      whereClause.date = { [Op.between]: [startDate, endDate] };

      if (filterMonth && filterMonth !== "null") {
        const month = parseInt(filterMonth);
        const monthStart = new Date(year, month - 1, 1);
        const monthEnd = new Date(year, month, 0);
        whereClause.date = { [Op.between]: [monthStart, monthEnd] };

        if (filterDay && filterDay !== "null") {
          const day = parseInt(filterDay);
          const specificDate = new Date(year, month - 1, day);
          const nextDay = new Date(year, month - 1, day + 1);
          whereClause.date = { [Op.gte]: specificDate, [Op.lt]: nextDay };
        }
      }
    } else if (filterMonth && filterMonth !== "null") {
      const currentYear = new Date().getFullYear();
      const month = parseInt(filterMonth);
      const monthStart = new Date(currentYear, month - 1, 1);
      const monthEnd = new Date(currentYear, month, 0);
      whereClause.date = { [Op.between]: [monthStart, monthEnd] };

      if (filterDay && filterDay !== "null") {
        const day = parseInt(filterDay);
        const specificDate = new Date(currentYear, month - 1, day);
        const nextDay = new Date(currentYear, month - 1, day + 1);
        whereClause.date = { [Op.gte]: specificDate, [Op.lt]: nextDay };
      }
    }

    // Fetch tickets with pagination
    const { count, rows: tickets } = await ticket.findAndCountAll({
      where: whereClause,
      order: [
        ["status", "ASC"],
        ["date", "ASC"],
      ],
      limit,
      offset,
      include: [
        {
          model: user,
          as: "detailer",
          attributes: ["name"],
        },
        {
          model: user,
          as: "secretary",
          attributes: ["name"],
        },
        {
          model: rating,
          as: "ratings",
          attributes: ["rating_number", "description"],
        },
      ],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      status: "success",
      data: {
        tickets,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: count,
          itemsPerPage: limit,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};
exports.getTicketsForStaff = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const filter = req.query.filter || "All";
    const filterMonth =
      req.query.filterMonth === "null" ? null : req.query.filterMonth;
    const filterDay =
      req.query.filterDay === "null" ? null : req.query.filterDay;
    const filterYear =
      req.query.filterYear === "null" ? null : req.query.filterYear;
    const ticketId = Number(req.query.ticketId) || null;

    const offset = (page - 1) * limit;

    const whereClause = {};

    if (filter !== "All") {
      whereClause.status = filter;
    }

    if (ticketId) {
      whereClause.id = ticketId;
    }

    const year = filterYear ? parseInt(filterYear) : new Date().getFullYear();

    if (filterYear && filterYear !== "null") {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      whereClause.date = { [Op.between]: [startDate, endDate] };

      if (filterMonth && filterMonth !== "null") {
        const month = parseInt(filterMonth);
        const monthStart = new Date(year, month - 1, 1);
        const monthEnd = new Date(year, month, 0);
        whereClause.date = { [Op.between]: [monthStart, monthEnd] };

        if (filterDay && filterDay !== "null") {
          const day = parseInt(filterDay);
          const specificDate = new Date(year, month - 1, day);
          const nextDay = new Date(year, month - 1, day + 1);
          whereClause.date = { [Op.gte]: specificDate, [Op.lt]: nextDay };
        }
      }
    } else if (filterMonth && filterMonth !== "null") {
      const currentYear = new Date().getFullYear();
      const month = parseInt(filterMonth);
      const monthStart = new Date(currentYear, month - 1, 1);
      const monthEnd = new Date(currentYear, month, 0);
      whereClause.date = { [Op.between]: [monthStart, monthEnd] };

      if (filterDay && filterDay !== "null") {
        const day = parseInt(filterDay);
        const specificDate = new Date(currentYear, month - 1, day);
        const nextDay = new Date(currentYear, month - 1, day + 1);
        whereClause.date = { [Op.gte]: specificDate, [Op.lt]: nextDay };
      }
    }

    if (req.user.role === "secretary") {
      whereClause[Op.or] = [
        {
          secretary_id: req.user.id,
          status: { [Op.in]: ["pending", "finished", "canceled"] },
        },
        { status: "requested" },
      ];
    } else if (req.user.role === "detailer") {
      whereClause.detailer_id = req.user.id;
      whereClause.status = { [Op.in]: ["pending", "finished", "canceled"] };
    }

    // Fetch with pagination
    const { count, rows: tickets } = await ticket.findAndCountAll({
      where: whereClause,
      order: [
        ["status", "ASC"],
        ["date", "ASC"],
      ],
      limit,
      offset,
      include: [
        { model: user, as: "user", attributes: ["name", "phone"] },
        { model: user, as: "detailer", attributes: ["name"] },
        { model: user, as: "secretary", attributes: ["name"] },
      ],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      status: "success",
      data: {
        tickets,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: count,
          itemsPerPage: limit,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching staff tickets:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};
exports.getTicketsByStatus = async (req, res) => {
  const status = req.params.status;
  const tickets = await ticket.findAll({
    where: { status },
    include: [
      {
        model: user,
        as: "user",
        attributes: ["name", "phone"],
      },
    ],
  });
  res.status(200).json({
    status: "success",
    data: tickets,
  });
};
exports.getRequestedTickets = async (req, res) => {
  try {
    const reqTickets = await ticket.findAll({
      where: { status: "requested" },
      include: {
        model: user,
        as: "user",
        attributes: ["name", "phone"],
      },
    });
    res.status(200).json({
      status: "success",
      data: reqTickets,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};
exports.getPendingTickets = async (req, res) => {
  try {
    var pendingTickets;
    if (req.user.role === "secretary") {
      // secretary
      pendingTickets = await ticket.findAll({
        where: { status: "pending", secretary_id: req.user.id },
        include: [
          {
            model: user,
            as: "user",
            attributes: ["name", "phone"],
          },
          {
            model: user,
            as: "detailer",
            attributes: ["name"],
          },
          {
            model: user,
            as: "secretary",
            attributes: ["name"],
          },
        ],
      });
    } else if (req.user.role === "detailer") {
      // detailer
      pendingTickets = await ticket.findAll({
        where: { status: "pending", detailer_id: req.user.id },
        include: [
          {
            model: user,
            as: "user",
            attributes: ["name", "phone"],
          },
          {
            model: user,
            as: "detailer",
            attributes: ["name"],
          },
          {
            model: user,
            as: "secretary",
            attributes: ["name"],
          },
        ],
      });
    } else if (req.user.role === "user") {
      pendingTickets = await ticket.findAll({
        where: { status: "pending", user_id: req.user_id },
        include: [
          {
            model: user,
            as: "user",
            attributes: ["name", "phone"],
          },
          {
            model: user,
            as: "detailer",
            attributes: ["name"],
          },
          {
            model: user,
            as: "secretary",
            attributes: ["name"],
          },
        ],
      });
    } else {
      // admin

      pendingTickets = await ticket.findAll({
        where: { status: "pending" },
        include: [
          {
            model: user,
            as: "user",
            attributes: ["name", "phone"],
          },
          {
            model: user,
            as: "detailer",
            attributes: ["name"],
          },
          {
            model: user,
            as: "secretary",
            attributes: ["name"],
          },
        ],
      });
    }

    res.status(200).json({
      status: "success",
      data: pendingTickets,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};
exports.getFinishedTickets = async (req, res) => {
  try {
    var finishedTickets;
    if (req.user.role === "secretary") {
      // secretary
      finishedTickets = await ticket.findAll({
        where: { status: "finished", secretary_id: req.user.id },
        include: [
          {
            model: user,
            as: "user",
            attributes: ["name", "phone"],
          },
          {
            model: user,
            as: "detailer",
            attributes: ["name"],
          },
          {
            model: user,
            as: "secretary",
            attributes: ["name"],
          },
        ],
      });
    } else if (req.user.role === "detailer") {
      // detailer
      finishedTickets = await ticket.findAll({
        where: { status: "finished", detailer_id: req.user.id },
        include: [
          {
            model: user,
            as: "user",
            attributes: ["name", "phone"],
          },
          {
            model: user,
            as: "detailer",
            attributes: ["name"],
          },
          {
            model: user,
            as: "secretary",
            attributes: ["name"],
          },
        ],
      });
    } else if (req.user.role === "user") {
      finishedTickets = await ticket.findAll({
        where: { status: "finished", user_id: req.user_id },
        include: [
          {
            model: user,
            as: "user",
            attributes: ["name", "phone"],
          },
          {
            model: user,
            as: "detailer",
            attributes: ["name"],
          },
          {
            model: user,
            as: "secretary",
            attributes: ["name"],
          },
        ],
      });
    } else {
      // admin

      finishedTickets = await ticket.findAll({
        where: { status: "finished" },
        include: {
          model: user,
          as: "user",
          attributes: ["name", "phone"],
        },
      });
    }

    res.status(200).json({
      status: "success",
      data: finishedTickets,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};
exports.getCanceldTickets = async (req, res) => {
  try {
    var canceledTickets;
    if (req.user.role === "secretary") {
      // secretary
      canceledTickets = await ticket.findAll({
        where: { status: "canceled", secretary_id: req.user.id },
        include: [
          {
            model: user,
            as: "user",
            attributes: ["name", "phone"],
          },
          {
            model: user,
            as: "detailer",
            attributes: ["name"],
          },
          {
            model: user,
            as: "secretary",
            attributes: ["name"],
          },
        ],
      });
    } else if (req.user.role === "detailer") {
      // detailer
      canceledTickets = await ticket.findAll({
        where: { status: "canceled", detailer_id: req.user.id },
        include: [
          {
            model: user,
            as: "user",
            attributes: ["name", "phone"],
          },
          {
            model: user,
            as: "detailer",
            attributes: ["name"],
          },
          {
            model: user,
            as: "secretary",
            attributes: ["name"],
          },
        ],
      });
    } else if (req.user.role === "user") {
      canceledTickets = await ticket.findAll({
        where: { status: "canceled", user_id: req.user_id },
        include: [
          {
            model: user,
            as: "user",
            attributes: ["name", "phone"],
          },
          {
            model: user,
            as: "detailer",
            attributes: ["name"],
          },
          {
            model: user,
            as: "secretary",
            attributes: ["name"],
          },
        ],
      });
    } else {
      // admin

      canceledTickets = await ticket.findAll({
        where: { status: "canceled" },
        include: [
          {
            model: user,
            as: "user",
            attributes: ["name", "phone"],
          },
          {
            model: user,
            as: "detailer",
            attributes: ["name"],
          },
          {
            model: user,
            as: "secretary",
            attributes: ["name"],
          },
        ],
      });
    }

    res.status(200).json({
      status: "success",
      data: canceledTickets,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};
//check time for detailer functionality
const isDetailerFree = async (detailer_id, date, start_time, end_time) => {
  const existingTickets = await ticket.findAll({
    where: {
      detailer_id,
      date,
      status: "pending",
    },
    attributes: ["start_time", "end_time"],
  });

  return !existingTickets.some(
    (t) => start_time < t.end_time && end_time > t.start_time,
  );
};
// change status functionalites
exports.acceptTicket = async (req, res) => {
  try {
    const { date, location, start_time, end_time, price, detailer_id } =
      req.body;
    const { ticket_id } = req.params;

    // 1️⃣ Check if detailer is free
    const free = await isDetailerFree(detailer_id, date, start_time, end_time);

    if (!free) {
      return res.status(400).json({
        status: "failed",
        message: "Detailer is busy at this time",
      });
    }

    // 2️⃣ If free, update ticket
    await ticket.update(
      {
        status: "pending",
        secretary_id: req.user.id,
        detailer_id,
        date,
        location,
        start_time,
        end_time,
        price,
      },
      { where: { id: ticket_id } },
    );

    res.status(201).json({
      status: "success",
      message: "Order has been accepted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};
exports.cancelticket = async (req, res) => {
  try {
    const { ticket_id } = req.params;
    const { cancel_reason } = req.body;
    const status = "canceled";
    const updatedTicket = await ticket.update(
      {
        status: status,
        cancel_reason: cancel_reason,
      },
      {
        where: { id: ticket_id },
      },
    );
    res.status(201).json({
      status: "success",
      message: "Your Order has been canceled ",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};
exports.finishTicket = async (req, res) => {
  try {
    const { ticket_id } = req.params;
    const { payment_method } = req.body;
    if (!payment_method)
      return res.status(400).json({
        status: "failed",
        message: "Please Select Payment method",
      });

    // Get the ticket first to access its price
    const existingTicket = await ticket.findByPk(ticket_id);
    if (!existingTicket) {
      return res.status(404).json({
        status: "failed",
        message: "Ticket not found",
      });
    }

    const updatedTicket = await ticket.update(
      {
        status: "finished",
        payment_method,
      },
      {
        where: { id: ticket_id },
      },
    );

    // Auto-create an "in" transaction on the Tickets account
    if (existingTicket.price) {
      try {
        const ticketsAccount = await account.findOne({
          where: { name: "Tickets", is_default: true },
        });

        if (ticketsAccount) {
          await transaction.create({
            account_id: ticketsAccount.id,
            type: "in",
            amount: parseFloat(existingTicket.price),
            description: `Ticket #${ticket_id} finished - ${existingTicket.service || "service"}`,
            ticket_id: parseInt(ticket_id),
          });
        }
      } catch (txError) {
        // Log but don't fail the ticket finish if transaction creation fails
        console.error(
          "Warning: Failed to create auto-transaction:",
          txError.message,
        );
      }
    }

    res.status(201).json({
      status: "success",
      message: "the order has finished",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};
