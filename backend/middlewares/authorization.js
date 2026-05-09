exports.authorizeAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      return res.status(401).json({
        status: "failed",
        message: "unauthorized",
      });
    next();
  } catch (error) {
    res.status(500).json({
      error: error || "Something went wrong",
    });
  }
};
exports.authorizeSecretary = (req, res, next) => {
  try {
    if (req.user.role !== "secretary")
      return res.status(401).json({
        status: "failed",
        message: "unauthorized",
      });
    next();
  } catch (error) {
    res.status(500).json({
      error: error || "Something went wrong",
    });
  }
};
exports.authorizeDetailer = (req, res, next) => {
  try {
    if (req.user.role !== "detailer")
      return res.status(401).json({
        status: "failed",
        message: "unauthorized",
      });
    next();
  } catch (error) {}
};
exports.authorizeUser = (req, res, next) => {
  try {
    if (req.user.role !== "user")
      return res.status(401).json({
        status: "failed",
        message: "unauthorized",
      });
    next();
  } catch (error) {}
};
