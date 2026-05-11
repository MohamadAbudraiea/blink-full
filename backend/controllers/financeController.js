const { Op, Sequelize } = require("sequelize");
const SQL = require("../Drivers/SQL_Driver");
const initModels = require("../models/init-models");
const models = initModels(SQL);
const { account, transaction, ticket } = models;

// ==================== ACCOUNTS ====================

exports.createAccount = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        status: "failed",
        message: "Account name is required",
      });
    }

    // Check if account name already exists
    const existing = await account.findOne({ where: { name: name.trim() } });
    if (existing) {
      return res.status(400).json({
        status: "failed",
        message: "An account with this name already exists",
      });
    }

    const newAccount = await account.create({
      name: name.trim(),
      description: description || null,
      is_default: false,
    });

    return res.status(201).json({
      status: "success",
      data: newAccount,
    });
  } catch (error) {
    console.error("Error creating account:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};

exports.getAccounts = async (req, res) => {
  try {
    const accounts = await account.findAll({
      order: [["created_at", "ASC"]],
      include: [
        {
          model: transaction,
          as: "transactions",
          attributes: ["type", "amount"],
        },
      ],
    });

    // Compute balance for each account
    const accountsWithBalance = accounts.map((acc) => {
      const data = acc.toJSON();
      let totalIn = 0;
      let totalOut = 0;

      (data.transactions || []).forEach((t) => {
        const amt = parseFloat(t.amount) || 0;
        if (t.type === "in") totalIn += amt;
        else totalOut += amt;
      });

      return {
        ...data,
        totalIn,
        totalOut,
        balance: totalIn - totalOut,
        transactionCount: (data.transactions || []).length,
        transactions: undefined, // remove raw transactions from list response
      };
    });

    return res.status(200).json({
      status: "success",
      data: accountsWithBalance,
    });
  } catch (error) {
    console.error("Error getting accounts:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const acc = await account.findByPk(id);
    if (!acc) {
      return res.status(404).json({
        status: "failed",
        message: "Account not found",
      });
    }

    if (acc.is_default) {
      return res.status(400).json({
        status: "failed",
        message: "Cannot delete the default Tickets account",
      });
    }

    // Check if account has transactions
    const txCount = await transaction.count({ where: { account_id: id } });
    if (txCount > 0) {
      return res.status(400).json({
        status: "failed",
        message: `Cannot delete account with ${txCount} existing transaction(s). Delete transactions first.`,
      });
    }

    await acc.destroy();

    return res.status(200).json({
      status: "success",
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};

// ==================== TRANSACTIONS ====================

exports.createTransaction = async (req, res) => {
  try {
    const { account_id, type, amount, description } = req.body;

    if (!account_id) {
      return res.status(400).json({
        status: "failed",
        message: "Account ID is required",
      });
    }

    if (!type || !["in", "out"].includes(type)) {
      return res.status(400).json({
        status: "failed",
        message: "Transaction type must be 'in' or 'out'",
      });
    }

    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({
        status: "failed",
        message: "Amount must be greater than 0",
      });
    }

    // Verify account exists
    const acc = await account.findByPk(account_id);
    if (!acc) {
      return res.status(404).json({
        status: "failed",
        message: "Account not found",
      });
    }

    const newTransaction = await transaction.create({
      account_id,
      type,
      amount: parseFloat(amount),
      description: description || null,
    });

    return res.status(201).json({
      status: "success",
      data: newTransaction,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};

exports.getAccountTransactions = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const filterType = req.query.type; // 'in', 'out', or undefined for all

    // Verify account exists
    const acc = await account.findByPk(id);
    if (!acc) {
      return res.status(404).json({
        status: "failed",
        message: "Account not found",
      });
    }

    const whereClause = { account_id: id };
    if (filterType && ["in", "out"].includes(filterType)) {
      whereClause.type = filterType;
    }

    const { count, rows: transactions } = await transaction.findAndCountAll({
      where: whereClause,
      order: [["created_at", "DESC"]],
      limit,
      offset,
      include: [
        {
          model: ticket,
          as: "ticket",
          attributes: ["id", "service", "price", "customer_name"],
          required: false,
        },
      ],
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      status: "success",
      data: {
        account: acc,
        transactions,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: count,
          itemsPerPage: limit,
        },
      },
    });
  } catch (error) {
    console.error("Error getting transactions:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const tx = await transaction.findByPk(id);
    if (!tx) {
      return res.status(404).json({
        status: "failed",
        message: "Transaction not found",
      });
    }

    await tx.destroy();

    return res.status(200).json({
      status: "success",
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};

// ==================== REPORTS ====================

exports.getFinanceReports = async (req, res) => {
  try {
    const { startDate, endDate, account_ids } = req.query;

    // Build where clause for transactions
    const whereClause = {};
    if (startDate && endDate) {
      whereClause.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    // If specific accounts are requested
    if (account_ids) {
      const ids = account_ids.split(",").map((id) => parseInt(id));
      whereClause.account_id = { [Op.in]: ids };
    }

    // Get all accounts
    const accounts = await account.findAll({
      order: [["created_at", "ASC"]],
    });

    // Get all transactions matching filters
    const transactions = await transaction.findAll({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      include: [
        {
          model: account,
          as: "account",
          attributes: ["id", "name"],
        },
      ],
      order: [["created_at", "ASC"]],
    });

    // Compute per-account summaries
    const accountSummaries = {};
    accounts.forEach((acc) => {
      accountSummaries[acc.id] = {
        id: acc.id,
        name: acc.name,
        totalIn: 0,
        totalOut: 0,
        balance: 0,
      };
    });

    // Monthly breakdown
    const monthlyData = {};

    transactions.forEach((tx) => {
      const amt = parseFloat(tx.amount) || 0;
      const accId = tx.account_id;

      // Per-account totals
      if (accountSummaries[accId]) {
        if (tx.type === "in") {
          accountSummaries[accId].totalIn += amt;
        } else {
          accountSummaries[accId].totalOut += amt;
        }
        accountSummaries[accId].balance =
          accountSummaries[accId].totalIn - accountSummaries[accId].totalOut;
      }

      // Monthly grouping
      const date = new Date(tx.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, totalIn: 0, totalOut: 0 };
      }

      if (tx.type === "in") {
        monthlyData[monthKey].totalIn += amt;
      } else {
        monthlyData[monthKey].totalOut += amt;
      }
    });

    // Totals
    const totals = Object.values(accountSummaries).reduce(
      (acc, s) => ({
        totalIn: acc.totalIn + s.totalIn,
        totalOut: acc.totalOut + s.totalOut,
        balance: acc.balance + s.balance,
      }),
      { totalIn: 0, totalOut: 0, balance: 0 }
    );

    // Sort monthly data by key
    const sortedMonthly = Object.values(monthlyData).sort((a, b) =>
      a.month.localeCompare(b.month)
    );

    return res.status(200).json({
      status: "success",
      data: {
        totals,
        accountSummaries: Object.values(accountSummaries),
        monthlyData: sortedMonthly,
      },
    });
  } catch (error) {
    console.error("Error getting finance reports:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};

exports.getAccountReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const acc = await account.findByPk(id);
    if (!acc) {
      return res.status(404).json({
        status: "failed",
        message: "Account not found",
      });
    }

    const whereClause = { account_id: id };
    if (startDate && endDate) {
      whereClause.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const transactions = await transaction.findAll({
      where: whereClause,
      order: [["created_at", "ASC"]],
    });

    let totalIn = 0;
    let totalOut = 0;
    const monthlyData = {};
    const dailyData = {};

    transactions.forEach((tx) => {
      const amt = parseFloat(tx.amount) || 0;

      if (tx.type === "in") totalIn += amt;
      else totalOut += amt;

      // Monthly
      const date = new Date(tx.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, totalIn: 0, totalOut: 0 };
      }
      if (tx.type === "in") monthlyData[monthKey].totalIn += amt;
      else monthlyData[monthKey].totalOut += amt;

      // Daily
      const dayKey = date.toISOString().split("T")[0];
      if (!dailyData[dayKey]) {
        dailyData[dayKey] = { day: dayKey, totalIn: 0, totalOut: 0 };
      }
      if (tx.type === "in") dailyData[dayKey].totalIn += amt;
      else dailyData[dayKey].totalOut += amt;
    });

    return res.status(200).json({
      status: "success",
      data: {
        account: acc,
        totals: {
          totalIn,
          totalOut,
          balance: totalIn - totalOut,
        },
        monthlyData: Object.values(monthlyData).sort((a, b) =>
          a.month.localeCompare(b.month)
        ),
        dailyData: Object.values(dailyData).sort((a, b) =>
          a.day.localeCompare(b.day)
        ),
      },
    });
  } catch (error) {
    console.error("Error getting account report:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};
