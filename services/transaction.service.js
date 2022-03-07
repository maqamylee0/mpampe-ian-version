const { Withdraw } = require("../models");
const clients = require("restify-clients");
const constants = require("../constants");

const client = clients.createJsonClient({
  url: constants.MOJALOOP.url,
  appendPath: true,
  headers: {},
});

exports.initializeTransfer = function (transaction, type = "transfer") {
  return new Promise((resolve) => {
    client.post(
      "/transfers",
      {
        homeTransactionId: transaction.transactionId,
        [type === "transfer" ? "from" : "to"]: {
          idType: constants.MOJALOOP.idType,
          idValue: constants.MOJALOOP.idValue,
        },
        [type === "donate" ? "from" : "to"]: {
          idType: transaction.idType,
          idValue: transaction.idValue,
        },
        amountType: "RECEIVE",
        currency: transaction.currency,
        amount: transaction.amount,
        transactionType: "TRANSFER",
        note: transaction.note,
      },
      function (err, req, res, obj) {
        resolve(obj);
      }
    );
  });
};

exports.confirmTransfer = function (transaction) {
  return new Promise((resolve) => {
    client.put(
      `/transfers/${transaction.transferId}`,
      { acceptParty: true },
      function (err, req, res, obj) {
        //again!
        client.put(
          `/transfers/${transaction.transferId}`,
          { acceptParty: true },
          async function (err, req, res, obj) {
            let trans = await Withdraw.create(transaction);
            resolve(trans);
          }
        );
      }
    );
  });
};
