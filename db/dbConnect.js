var pg = require('pg')
var mysql = require('mysql')


var pgPool = new pg.Pool({
  user: 'ukiyo_db_user',
  host: 'dpg-cbkcujc41ls3clng6q80-a.oregon-postgres.render.com',
  database: 'ukiyo_db',
  password: 'DpDuOcKOUwT45Hl58oKV6XuahcC0myML',
  port: '5432',
  ssl: true
})


var mysqlPool = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '12345',
  database: 'data'
})

// module.exports =  {
//   name: '远程PostgreSQL数据库',
//   pool: pgPool
// };

module.exports =  {
  name: '本地MySQL数据库',
  pool: mysqlPool
};
