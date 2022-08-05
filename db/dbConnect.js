var pg = require('pg')

var pgConfig = {
  user: 'ukiyo_db_user',
  host: 'dpg-cbkcujc41ls3clng6q80-a.oregon-postgres.render.com',
  database: 'ukiyo_db',
  password: 'DpDuOcKOUwT45Hl58oKV6XuahcC0myML',
  port: '5432',
  ssl: true
}
var pool = new pg.Pool(pgConfig)

module.exports = pool;