

const Pool = require('pg').Pool
const  pool = new Pool({
    user: 'manish',
    database: 'postgres',
    password: '1234',
    port: 5432,
    host: 'localhost',
  })

async function show_db(){
    const res = await pool.query('select * from public.user;')
    console.log(res.rows);
}

  show_db()
  module.exports = pool;