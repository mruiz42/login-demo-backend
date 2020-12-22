const {Tedis, TedisPool} = require('tedis')

// Redis environment variables
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_PASS = process.env.REDIS_PASS;

const tedis = new Tedis({
  host: REDIS_HOST,
  port: REDIS_PORT
});

module.exports = tedis;