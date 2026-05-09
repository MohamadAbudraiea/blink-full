const SQL = require("../Drivers/SQL_Driver");
const initModels = require("../models/init-models");
const models = initModels(SQL);
const { user, ticket, rating } = models;
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

exports.rateticket = async (req, res) => {
  try {
    const { ticket_id, rating_number, description } = req.body;
    const findTicket = await ticket.findOne({
      where: { id: ticket_id },
    });
    if (!findTicket || findTicket.status !== "finished")
      return res.status(204).json({
        status: "failed",
        message: "the token is not finished",
      });
    if (rating_number > 5 || rating_number < 0) {
      return res.status(204).json({
        status: "failed",
        message: "wrong input",
      });
    }

    const newRating = await rating.create({
      ticket_id: ticket_id,
      user_id: findTicket.user_id,
      rating_number: rating_number,
      description: description,
      isPublished: false,
    });

    return res.status(204).json({
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
exports.getTicketRating = async (req, res) => {
  try {
    const { ticket_id } = req.params;

    const ratingForTicket = await rating.findOne({
      where: {
        ticket_id,
      },
    });
    if (!ratingForTicket)
      return res.status(200).json({
        data: "Not Rated Yet",
      });

    res.status(200).json({
      status: "success",
      data: ratingForTicket,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
exports.getRatingsWithTickets = async (req, res) => {
  try {
    const ratingsWithTickets = await rating.findAll({
      where: {
        isPublished: true,
      },
      include: [
        {
          model: ticket,
          as: "ticket",
          attributes: ["service"],
        },
        {
          model: user,
          as: "user",
          attributes: ["name"],
        },
      ],
      limit: 100,
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      status: "success",
      data: ratingsWithTickets,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
exports.togglePublishTicket = async (req, res) => {
  try {
    const { id } = req.body;

    const isPublished = await rating.findOne({
      where: { id },
      attributes: ["isPublished"],
    });

    const published = isPublished.isPublished;

    await rating.update(
      {
        isPublished: !published,
      },
      {
        where: { id },
      }
    );

    res.status(201).json({
      status: "success",
      message: "Ticket Has Been Published",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
