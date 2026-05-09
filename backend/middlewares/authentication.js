const express = require("express");
const jwt = require("jsonwebtoken");
//------------------------------------------
const SQL = require("../Drivers/SQL_Driver");
const initModels = require("../models/init-models");
const models = initModels(SQL);
const { user } = models;
//------------------------------------------

const authenticateUser = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(403).json({
        status: "failed",
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach full user info from token
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
      phone: decoded.phone,
      name: decoded.name,
      created_at: decoded.created_at,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      status: "failed",
      message: "Invalid or expired token",
    });
  }
};

module.exports = authenticateUser;
