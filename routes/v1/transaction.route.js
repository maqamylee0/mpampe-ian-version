const express = require("express");
const { transactionController } = require("../../controllers");
const catchAsync = require("../../utils/catchAsync");
const router = express.Router({ mergeParams: true });

router
  .route("/withdraw")
  .post(catchAsync(transactionController.initializeTransfer));

router
  .route("/transfer")
  .post(catchAsync(transactionController.confirmTransfer));

module.exports = router;
