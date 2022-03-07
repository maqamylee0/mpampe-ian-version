const mongoose = require("mongoose");
const {logger} = require("./logger");
const constants = require("./constants");

const database = {};
database.isConnectedToDb = false;

database.isConnected = function isConnected() {
  return database.isConnectedToDb;
};

mongoose.connection.on("error", (err) => {
  logger.error(`Got error event ${err}`);
});

mongoose.connection.on("disconnected", () => {
  logger.error("Got disconnected event from database");
  database.isConnectedToDb = false;
});

mongoose.connection.o n("reconnected", () => {
  logger.debug("Got reconnected event from database");
  database.isConnectedToDb = true;
});

database.connect = function connect() {
  mongoose.set("debug", process.env.NODE_ENV !== "production");
  mongoose
    .connect('mongodb+srv://mpampe_v1:mpampe_v1mongo@mpampe.m77zv.mongodb.net/MpaMpe?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      connectTimeoutMS: 3000,
      useFindAndModify: false,
    })
    .then(() => {
      logger.log("Successfully connected to system database");
      database.isConnectedToDb = true;
    })
    .catch((err) => {
      logger.error(
        `An error occurred while trying to connect to the system database, retrying in ${constants.database.connectRetry}s. Err: ${err}`
      );
      setTimeout(database.connect, constants.database.connectRetry * 1000);
    });
};

database.disconnect = function disconnect() {
  if (database.isConnected()) {
    mongoose
      .disconnect()
      .then(() => {
        database.isConnectedToDb = false;
      })
      .catch((err) => {
        logger.error(
          `An error occurred while trying to disconnect from the system database. Err: ${err}`
        );
      });
  }
};

module.exports = database;
