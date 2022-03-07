require("express-async-errors")
const cookieParser = require("cookie-parser");
const httpStatus = require("http-status");
const express = require("express");
const logger = require("morgan");
const path = require("path");
const cors = require("cors");
const AppError = require("./utils/AppError");
const { errorConverter, errorHandler } = require("./middlewares/error");
const { authLimiter } = require("./middlewares/rateLimiter");
const apiV1Router = require("./routes/v1");
const frontendRouter = require("./routes/frontend");
const app = express();
const createError = require("http-errors");
const session = require("express-session");
const constants = require("./constants");

app.use(
  session({
    secret: constants.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

// enable cors
const corsOptions = {
  exposedHeaders: ["X-Access-Token"],
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
app.use(logger("dev"));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", require("express-ejs-extend"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(express.static(path.join(__dirname, "public")));

//link frontend app
app.use("/", frontendRouter);

if (app.get("env") === "production") {
  app.disable("x-powered-by");
  // limit repeated failed requests to auth endpoints
  app.use("/api/v1/auth/login", authLimiter);
}

app.use("/api/v1", apiV1Router);

//this is for api mode only
// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new AppError("Not found", httpStatus.NOT_FOUND));
});

// convert error to AppError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

module.exports = app;
