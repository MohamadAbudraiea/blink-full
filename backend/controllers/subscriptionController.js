const SQL = require("../Drivers/SQL_Driver");
const initModels = require("../models/init-models");
const models = initModels(SQL);
const { user, ticket, subscription } = models;

// Helper to check if detailer is free
const isDetailerFree = async (detailer_id, date, start_time, end_time) => {
  if (!detailer_id) return true; // If no detailer assigned, no conflict to check
  const existingTickets = await ticket.findAll({
    where: {
      detailer_id,
      date,
      status: "pending",
    },
    attributes: ["start_time", "end_time"],
  });

  return !existingTickets.some(
    (t) => start_time < t.end_time && end_time > t.start_time
  );
};

exports.createSubscription = async (req, res) => {
  const transaction = await SQL.transaction();
  try {
    const {
      isAnonymous,
      user_id,
      customer_name,
      customer_phone,
      plan_type,
      total_price,
      tickets, // array of ticket objects
    } = req.body || {};

    const isInternalUser = req.user.role === "admin" || req.user.role === "secretary";
    const status = isInternalUser ? "pending" : "requested";
    const secretary_id = isInternalUser ? req.user.id : null;

    if (!["2", "4", "8"].includes(plan_type)) {
      return res.status(400).json({ status: "failed", message: "Invalid plan type. Must be 2, 4, or 8." });
    }

    if (!tickets || !Array.isArray(tickets) || tickets.length !== parseInt(plan_type)) {
      return res.status(400).json({ status: "failed", message: `You must provide exactly ${plan_type} tickets.` });
    }

    const subData = {
      plan_type,
      status,
      total_price: total_price || null,
      secretary_id: secretary_id || null,  // sanitize empty strings to null
    };

    if (isAnonymous && isInternalUser) {
      if (!customer_name || !customer_phone) {
        return res.status(400).json({ status: "failed", message: "Customer name and phone are required for anonymous subscriptions" });
      }
      subData.customer_name = customer_name;
      subData.customer_phone = customer_phone;
    } else {
      const finalUserId = (user_id || null) || (req.user.role === "user" ? req.user.id : null);
      if (!finalUserId) {
        return res.status(400).json({ status: "failed", message: "User ID is required" });
      }
      subData.user_id = finalUserId;
    }

    // Validate detailer availability for all tickets if detailers are assigned
    for (const t of tickets) {
      if (t.detailer_id && t.date && t.start_time && t.end_time) {
        const free = await isDetailerFree(t.detailer_id, t.date, t.start_time, t.end_time);
        if (!free) {
          throw new Error(`Detailer is busy on ${t.date} between ${t.start_time} and ${t.end_time}`);
        }
      }
    }

    const newSub = await subscription.create(subData, { transaction });

    // Create all tickets
    const createdTickets = [];
    for (const t of tickets) {
      const ticketData = {
        ...t,
        // Sanitize UUID fields — PostgreSQL rejects empty strings for UUID columns
        detailer_id: t.detailer_id || null,
        secretary_id: secretary_id || null,
        subscription_id: newSub.id,
        status,
        user_id: subData.user_id || null,
        customer_name: subData.customer_name || null,
        customer_phone: subData.customer_phone || null,
      };
      const createdTicket = await ticket.create(ticketData, { transaction });
      createdTickets.push(createdTicket);
    }

    await transaction.commit();

    return res.status(201).json({
      status: "success",
      data: {
        subscription: newSub,
        tickets: createdTickets
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({
      status: "failed",
      message: error.message || "Something went wrong while creating the subscription",
    });
  }
};

exports.getSubscriptions = async (req, res) => {
  try {
    const isInternalUser = req.user.role === "admin" || req.user.role === "secretary";

    const where = {};
    if (!isInternalUser) {
      where.user_id = req.user.id;
    }

    const subscriptions = await subscription.findAll({
      where,
      include: [
        {
          model: ticket,
          as: "tickets",
          include: [
            { model: user, as: "detailer", attributes: ["name"] },
            { model: user, as: "secretary", attributes: ["name"] }
          ]
        },
        {
          model: user,
          as: "user",
          attributes: ["name", "phone"]
        }
      ],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      status: "success",
      data: subscriptions,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};

exports.cancelSubscription = async (req, res) => {
  const transaction = await SQL.transaction();
  try {
    const { id } = req.params;

    await subscription.update({ status: "canceled" }, { where: { id }, transaction });
    await ticket.update({ status: "canceled", cancel_reason: "Subscription canceled" }, { where: { subscription_id: id }, transaction });

    await transaction.commit();
    res.status(200).json({ status: "success", message: "Subscription canceled" });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ status: "error", message: error.message });
  }
};
