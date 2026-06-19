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
          await transaction.rollback();
          return res.status(400).json({
            status: "failed",
            message: `Detailer is busy on ${t.date} between ${t.start_time} and ${t.end_time}`,
          });
        }
      }
    }

    const newSub = await subscription.create(subData, { transaction });

    // Create all tickets
    const createdTickets = [];
    for (const t of tickets) {
      const ticketData = {
        ...t,
        // Sanitize fields — PostgreSQL rejects empty strings for UUID/TIME columns
        detailer_id: t.detailer_id || null,
        start_time: t.start_time || null,
        end_time: t.end_time || null,
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
            { model: user, as: "user", attributes: ["name", "phone"] },
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

/**
 * POST /admin/subscription/resubscribe/:id/preview
 * POST /user/subscription/resubscribe/:id/preview
 * Returns a preview of re-created subscription tickets advanced by ~30 days.
 * Does NOT write to the database.
 */
exports.previewResubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const existingSub = await subscription.findOne({
      where: { id },
      include: [
        {
          model: ticket,
          as: "tickets",
        },
      ],
    });

    if (!existingSub) {
      return res.status(404).json({ status: "failed", message: "Subscription not found" });
    }

    // Advance each ticket date by 30 days
    const previewTickets = existingSub.tickets.map((t) => {
          const newDate = t.date
            ? (() => {
                const [y, m, d] = t.date.split("-").map(Number);
                const dateObj = new Date(y, m - 1, d, 12, 0, 0); // local noon to avoid DST skips
                dateObj.setDate(dateObj.getDate() + 28); // exactly 4 weeks later preserves day of the week
                const ny = dateObj.getFullYear();
                const nm = String(dateObj.getMonth() + 1).padStart(2, "0");
                const nd = String(dateObj.getDate()).padStart(2, "0");
                return `${ny}-${nm}-${nd}`;
              })()
            : null;

      return {
        service: t.service,
        typeOfService: t.typeOfService,
        location: t.location,
        note: t.note,
        detailer_id: t.detailer_id || null,
        date: newDate,
        start_time: t.start_time || null,
        end_time: t.end_time || null,
        price: t.price || null,
      };
    });

    return res.status(200).json({
      status: "success",
      data: {
        plan_type: existingSub.plan_type,
        total_price: existingSub.total_price,
        tickets: previewTickets,
      },
    });
  } catch (error) {
    console.error("previewResubscription error:", error);
    return res.status(500).json({
      status: "failed",
      message: error.message || "Something went wrong",
    });
  }
};

/**
 * POST /admin/subscription/resubscribe/:id/confirm
 * POST /user/subscription/resubscribe/:id/confirm
 * Body: { tickets (edited), total_price }
 * Creates a new subscription cloned from the original with updated ticket data.
 */
exports.confirmResubscription = async (req, res) => {
  const sqlTransaction = await SQL.transaction();
  try {
    const { id } = req.params;
    const { tickets: newTickets, total_price } = req.body;

    const existingSub = await subscription.findByPk(id);
    if (!existingSub) {
      await sqlTransaction.rollback();
      return res.status(404).json({ status: "failed", message: "Subscription not found" });
    }

    const isInternalUser = req.user.role === "admin" || req.user.role === "secretary";
    const status = isInternalUser ? "pending" : "requested";
    const secretary_id = isInternalUser ? req.user.id : null;

    if (status === "pending") {
      for (let i = 0; i < newTickets.length; i++) {
        const t = newTickets[i];
        if (t.detailer_id && t.date && t.start_time && t.end_time) {
          const free = await isDetailerFree(t.detailer_id, t.date, t.start_time, t.end_time);
          if (!free) {
            await sqlTransaction.rollback();
            return res.status(400).json({
              status: "failed",
              message: `The selected detailer is busy on ${t.date} for ticket #${i + 1}.`,
            });
          }
        }
      }
    }

    const subData = {
      plan_type: existingSub.plan_type,
      status,
      total_price: total_price !== undefined ? total_price : existingSub.total_price,
      secretary_id,
      user_id: existingSub.user_id || null,
      customer_name: existingSub.customer_name || null,
      customer_phone: existingSub.customer_phone || null,
    };

    const newSub = await subscription.create(subData, { transaction: sqlTransaction });

    const createdTickets = [];
    for (const t of newTickets) {
      const ticketData = {
        ...t,
        detailer_id: t.detailer_id || null,
        secretary_id,
        subscription_id: newSub.id,
        status,
        user_id: existingSub.user_id || null,
        customer_name: existingSub.customer_name || null,
        customer_phone: existingSub.customer_phone || null,
      };
      const created = await ticket.create(ticketData, { transaction: sqlTransaction });
      createdTickets.push(created);
    }

    await sqlTransaction.commit();

    return res.status(201).json({
      status: "success",
      data: { subscription: newSub, tickets: createdTickets },
    });
  } catch (error) {
    await sqlTransaction.rollback();
    console.error("confirmResubscription error:", error);
    return res.status(500).json({
      status: "failed",
      message: error.message || "Something went wrong",
    });
  }
};
