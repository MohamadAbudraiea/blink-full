const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
//-----------------------------------------
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV === "development") app.use(morgan("common"));

const allowedOrigins = [
  "https://blink-cars.com",
  "https://www.blink-cars.com",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Handle preflight
app.options(
  /.*/,
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

// authentication // autharization
const authenticateUser = require("./middlewares/authentication");
const autharizationMiddleware = require("./middlewares/authorization");
// router imports
const authRouter = require("./routers/authRouter");
const adminRouter = require("./routers/adminRouter");
const userRouter = require("./routers/userRouter");
const sharedRouter = require("./routers/shared");
const secretaryRouter = require("./routers/secretaryRouter");
const detailerRouter = require("./routers/detilaerRouter");
// routing
app.use("/auth", authRouter);
// authinticate then authorize then enter the router
app.use(
  "/admin",
  authenticateUser,
  autharizationMiddleware.authorizeAdmin,
  adminRouter,
);
app.use(
  "/user",
  authenticateUser,
  autharizationMiddleware.authorizeUser,
  userRouter,
);
app.use(
  "/detailer",
  authenticateUser,
  autharizationMiddleware.authorizeDetailer,
  detailerRouter,
);
app.use(
  "/secretary",
  authenticateUser,
  autharizationMiddleware.authorizeSecretary,
  secretaryRouter,
);
app.use("/shared", sharedRouter);
module.exports = app;
