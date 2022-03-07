module.exports = Object.freeze({
  database: {
    url: process.env.MPAMPE_MONGODB_SERVER || "mongodb://localhost",
    name: process.env.DATABASE_NAME || "mpa-mpe",
    connectRetry: 5,
  },
  SECRET_KEY: "dsW7UoHqhl1FnQJmXm75NgpGb8243z7s",
  DEFAULT_ADMIN: {
    USERNAME: "admin",
    PASSWORD: "admin",
  },

  MOJALOOP: {
    url:
      process.env.MOJALOOP_URL ||
      "http://jcash-sdk-scheme-adapter-outbound.sandbox.mojaloop.io",
    idType: process.env.ID_TYPE || "MSISDN",
    idValue: process.env.ID_VALUE || "589408120",
  },
});
