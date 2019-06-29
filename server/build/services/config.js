"use strict";

var dotenv = require('dotenv');

dotenv.config();

var connection = function connection() {
  switch (process.env.NODE_ENV) {
    case 'test':
      return process.env.PG_URL_TEST;

    case 'development':
      return process.env.PG_URL;

    case 'production':
      return process.env.DATABASE_URL;

    default:
      return process.env.PG_URL;
  }
};

module.exports = connection();