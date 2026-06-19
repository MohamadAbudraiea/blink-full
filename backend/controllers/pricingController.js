const SQL = require("../Drivers/SQL_Driver");
const initModels = require("../models/init-models");
const models = initModels(SQL);
const { servicePricing } = models;

const SERVICES = ["wash", "dryclean", "polish", "graphene", "nanoceramic"];

/**
 * Seed default rows if they don't exist, then return all pricing rows.
 */
const seedAndGet = async () => {
  for (const service of SERVICES) {
    await servicePricing.findOrCreate({
      where: { service },
      defaults: {
        base_price: 0,
        plan_2_price: 0,
        plan_4_price: 0,
        plan_8_price: 0,
      },
    });
  }
  return servicePricing.findAll({ order: [["service", "ASC"]] });
};

/**
 * GET /shared/pricing  — public, no auth required
 * GET /admin/pricing   — admin only
 */
exports.getPricing = async (req, res) => {
  try {
    const rows = await seedAndGet();
    return res.status(200).json({ status: "success", data: rows });
  } catch (error) {
    console.error("getPricing error:", error);
    return res
      .status(500)
      .json({ status: "error", message: error.message || "Something went wrong" });
  }
};

/**
 * PUT /admin/pricing
 * Body: { service, base_price, plan_2_price, plan_4_price, plan_8_price }
 */
exports.updatePricing = async (req, res) => {
  try {
    const { service, base_price, plan_2_price, plan_4_price, plan_8_price } =
      req.body;

    if (!SERVICES.includes(service)) {
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid service name" });
    }

    const [row, created] = await servicePricing.findOrCreate({
      where: { service },
      defaults: { base_price: 0, plan_2_price: 0, plan_4_price: 0, plan_8_price: 0 },
    });

    await row.update({
      base_price: parseFloat(base_price) || 0,
      plan_2_price: parseFloat(plan_2_price) || 0,
      plan_4_price: parseFloat(plan_4_price) || 0,
      plan_8_price: parseFloat(plan_8_price) || 0,
    });

    return res.status(200).json({
      status: "success",
      message: `Pricing for ${service} updated`,
      data: row,
    });
  } catch (error) {
    console.error("updatePricing error:", error);
    return res
      .status(500)
      .json({ status: "error", message: error.message || "Something went wrong" });
  }
};
