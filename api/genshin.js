var pool = require('../db/dbConnect')
var { Res, Page } = require('../utils/deal')
var SqlString = require('sqlstring')

// genshin 的api实现方法
module.exports = {
  getConstUrlInfo(req, res, next) {
    let key = req.query.key || ''
    let sql = SqlString.format(`SELECT * FROM genshin_const WHERE key LIKE ?;`, [`%${key}%`])
    pool.query(sql, [], (err, data) => {
      if(err) {
        res.json(Res(500, [], '获取失败!' + err));
      } else {
        res.json(Res(200, data.rows))
      }
    })
  },
  
  getRoleInfo(req, res, next) {
    let body = req.body
    body.page = Page(body.page)
    let total = 0
    let whereStr = ''
    let whereArr = []
    if(body.name) {
      whereStr += `r."name" LIKE ? AND `
      whereArr.push(`%${body.name}%`)
    }
    if(body.star != null) {
      whereStr += `r."star" = ? AND `
      whereArr.push(body.star)
    }
    if(body.element != null) {
      whereStr += `r."element" = ? AND `
      whereArr.push(body.element)
    }
    if(body.area != null) {
      whereStr += `r."area" = ? AND `
      whereArr.push(body.area)
    }
    if(body.book != null) {
      whereStr += `r."book" = ? AND `
      whereArr.push(body.book)
    }
    if(body.week != null) {
      whereStr += `r."week" = ? AND `
      whereArr.push(body.week)
    }
    whereStr += 'TRUE'
    let sql0 = SqlString.format(`SELECT COUNT(1) AS "total" FROM genshin_role r WHERE ${whereStr}`, whereArr)
    pool.query(sql0, [], (err0, data0) => {
      if(err0) {
        return res.json(Res(500, [], '总数获取失败!' + err0));
      } else {
        total = Number(data0.rows[0].total)
        let sql = SqlString.format(
          `SELECT
            r."id",
            r."name",
            r."en_name",
            r."star",
            ra."element_type",
            ra1."weapon_type",
            ra2."book_type",
            ra3."week_name",
            ra4."area_type",
            r."mhy_url",
            r."wiki_url" 
          FROM
            genshin_role r
            LEFT JOIN genshin_relation ra ON r."element" = ra."id"
            LEFT JOIN genshin_relation ra1 ON r."weapon" = ra1."id"
            LEFT JOIN genshin_relation ra2 ON r."book" = ra2."id"
            LEFT JOIN genshin_relation ra3 ON r."week" = ra3."id"
            LEFT JOIN genshin_relation ra4 ON r."area" = ra4."id" 
          WHERE ${whereStr}
          LIMIT ? OFFSET ?
        `, [...whereArr, body.page.n, body.page.m])
        pool.query(sql, [], (err, data) => {
          if(err) {
            return res.json(Res(500, [], '列表获取失败!' + err));
          } else {
            let resData = {
              records: data.rows,
              size: body.page.pageSize,
              current: body.page.pageNum,
              total
            }
            res.json(Res(200, resData))
          }
        })
      }
    })
  },

  getRelationInfo(req, res, next) {
    let type = req.query.type || ''
    let sql = `SELECT * FROM genshin_relation AS r ORDER BY r."id" ASC`
    const typeMap = {
      element: `r."element_type"`,
      weapon: `r."weapon_type"`,
      book: `r."book_type"`,
      week: `r."week_name"`,
      area: `r."area_type"`,
      room: `r."room_type"`
    }
    let params = typeMap[type] || ''
    if(params) {
      sql = `SELECT r."id", ${params} FROM genshin_relation AS r WHERE ${params} <> '' ORDER BY r."id" ASC`
    }
    pool.query(sql, [], (err, data) => {
      if(err) {
        res.json(Res(500, [], '获取失败!' + err));
      } else {
        res.json(Res(200, data.rows))
      }
    })
  },

  getWeaponInfo(req, res, next) {
    let body = req.body
    body.page = Page(body.page)
    let total = 0
    let whereStr = ''
    let whereArr = []
    if(body.name) {
      whereStr += `w."name" LIKE ? AND `
      whereArr.push(`%${body.name}%`)
    }
    if(body.star != null) {
      whereStr += `w."star" = ? AND `
      whereArr.push(body.star)
    }
    if(body.item != null) {
      whereStr += `w."item" = ? AND `
      whereArr.push(body.item)
    }
    if(body.week != null) {
      whereStr += `w."week" = ? AND `
      whereArr.push(body.week)
    }
    whereStr += 'TRUE'
    let sql0 = SqlString.format(`SELECT COUNT(1) AS "total" FROM genshin_weapon w WHERE ${whereStr}`, whereArr)
    pool.query(sql0, [], (err0, data0) => {
      if(err0) {
        return res.json(Res(500, [], '总数获取失败!' + err0));
      } else {
        total = Number(data0.rows[0].total)
        let sql = SqlString.format(
          `SELECT
            w."id",
            w."name",
            w."star",
            ra1."weapon_type",
            ra2."item_type",
            ra3."week_name",
            w."mhy_url",
            w."wiki_url" 
          FROM
            genshin_weapon w
            LEFT JOIN genshin_relation ra1 ON w."weapon" = ra1."id"
            LEFT JOIN genshin_relation ra2 ON w."item" = ra2."id"
            LEFT JOIN genshin_relation ra3 ON w."week" = ra3."id"
          WHERE ${whereStr}
          LIMIT ? OFFSET ?
        `, [...whereArr, body.page.n, body.page.m])
        pool.query(sql, [], (err, data) => {
          if(err) {
            return res.json(Res(500, [], '列表获取失败!' + err));
          } else {
            let resData = {
              records: data.rows,
              size: body.page.pageSize,
              current: body.page.pageNum,
              total
            }
            res.json(Res(200, resData))
          }
        })
      }
    })
  },

  getItemInfo(req, res, next) {
    let body = req.body
    body.page = Page(body.page)
    let total = 0
    let whereStr = ''
    let whereArr = []
    if(body.name) {
      whereStr += `w."name" LIKE ? AND `
      whereArr.push(`%${body.name}%`)
    }
    if(body.star != null) {
      whereStr += `w."star" = ? AND `
      whereArr.push(body.star)
    }
    whereStr += 'TRUE'
    let sql0 = SqlString.format(`SELECT COUNT(1) AS "total" FROM genshin_item w WHERE ${whereStr}`, whereArr)
    pool.query(sql0, [], (err0, data0) => {
      if(err0) {
        return res.json(Res(500, [], '总数获取失败!' + err0));
      } else {
        total = Number(data0.rows[0].total)
        let sql = SqlString.format(
          `SELECT
            w."id",
            w."name",
            w."star",
            w."mhy_url",
            w."wiki_url" 
          FROM
            genshin_item w
          WHERE ${whereStr}
          LIMIT ? OFFSET ?
        `, [...whereArr, body.page.n, body.page.m])
        pool.query(sql, [], (err, data) => {
          if(err) {
            return res.json(Res(500, [], '列表获取失败!' + err));
          } else {
            let resData = {
              records: data.rows,
              size: body.page.pageSize,
              current: body.page.pageNum,
              total
            }
            res.json(Res(200, resData))
          }
        })
      }
    })
  },

  getBookInfo(req, res, next) {
    let body = req.body
    body.page = Page(body.page)
    let total = 0
    let whereStr = ''
    let whereArr = []
    if(body.name) {
      whereStr += `w."name" LIKE ? AND `
      whereArr.push(`%${body.name}%`)
    }
    if(body.star != null) {
      whereStr += `w."star" = ? AND `
      whereArr.push(body.star)
    }
    whereStr += 'TRUE'
    let sql0 = SqlString.format(`SELECT COUNT(1) AS "total" FROM genshin_book w WHERE ${whereStr}`, whereArr)
    pool.query(sql0, [], (err0, data0) => {
      if(err0) {
        return res.json(Res(500, [], '总数获取失败!' + err0));
      } else {
        total = Number(data0.rows[0].total)
        let sql = SqlString.format(
          `SELECT
            w."id",
            w."name",
            w."star",
            w."mhy_url",
            w."wiki_url" 
          FROM
            genshin_book w
          WHERE ${whereStr}
          LIMIT ? OFFSET ?
        `, [...whereArr, body.page.n, body.page.m])
        pool.query(sql, [], (err, data) => {
          if(err) {
            return res.json(Res(500, [], '列表获取失败!' + err));
          } else {
            let resData = {
              records: data.rows,
              size: body.page.pageSize,
              current: body.page.pageNum,
              total
            }
            res.json(Res(200, resData))
          }
        })
      }
    })
  },
}