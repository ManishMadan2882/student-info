

const Pool = require('pg').Pool
const  pool = new Pool({
    user: 'manish',
    database: 'postgres',
    password: '1234',
    port: 5432,
    host: 'localhost',
  })



  module.exports = pool;