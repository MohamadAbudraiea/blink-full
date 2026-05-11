var DataTypes = require("sequelize").DataTypes;
var _OTP = require("./OTP");
var _rating = require("./rating");
var _ticket = require("./ticket");
var _user = require("./user");
var _subscription = require("./subscription");
var _account = require("./account");
var _transaction = require("./transaction");

function initModels(sequelize) {
  var OTP = _OTP(sequelize, DataTypes);
  var rating = _rating(sequelize, DataTypes);
  var ticket = _ticket(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var subscription = _subscription(sequelize, DataTypes);
  var account = _account(sequelize, DataTypes);
  var transaction = _transaction(sequelize, DataTypes);

  rating.belongsTo(ticket, { as: "ticket", foreignKey: "ticket_id"});
  ticket.hasMany(rating, { as: "ratings", foreignKey: "ticket_id"});
  OTP.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(OTP, { as: "OTPs", foreignKey: "user_id"});
  rating.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(rating, { as: "ratings", foreignKey: "user_id"});
  ticket.belongsTo(user, { as: "detailer", foreignKey: "detailer_id"});
  user.hasMany(ticket, { as: "tickets", foreignKey: "detailer_id"});
  ticket.belongsTo(user, { as: "secretary", foreignKey: "secretary_id"});
  user.hasMany(ticket, { as: "secretary_tickets", foreignKey: "secretary_id"});
  ticket.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(ticket, { as: "user_tickets", foreignKey: "user_id"});
  
  subscription.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(subscription, { as: "subscriptions", foreignKey: "user_id"});
  
  subscription.belongsTo(user, { as: "secretary", foreignKey: "secretary_id"});
  user.hasMany(subscription, { as: "secretary_subscriptions", foreignKey: "secretary_id"});
  
  ticket.belongsTo(subscription, { as: "subscription", foreignKey: "subscription_id"});
  subscription.hasMany(ticket, { as: "tickets", foreignKey: "subscription_id", onDelete: "CASCADE"});

  // Finance associations
  transaction.belongsTo(account, { as: "account", foreignKey: "account_id"});
  account.hasMany(transaction, { as: "transactions", foreignKey: "account_id"});
  
  transaction.belongsTo(ticket, { as: "ticket", foreignKey: "ticket_id"});
  ticket.hasMany(transaction, { as: "transactions", foreignKey: "ticket_id"});

  return {
    OTP,
    rating,
    ticket,
    user,
    subscription,
    account,
    transaction,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
